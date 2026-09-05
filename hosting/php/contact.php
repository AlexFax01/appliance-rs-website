<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $body): never {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES);
    exit;
}

function clean(mixed $value, int $max = 1500): string {
    return trim(is_string($value) ? $value : '');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, ['ok' => false, 'code' => 'method_not_allowed']);
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 4000000) respond(413, ['ok' => false, 'code' => 'payload_too_large']);

$contentType = (string)($_SERVER['CONTENT_TYPE'] ?? '');
if (str_starts_with($contentType, 'multipart/form-data')) {
    $payload = $_POST['payload'] ?? null;
    if (!is_string($payload) || strlen($payload) > 32768 || array_diff(array_keys($_POST), ['payload']) || array_diff(array_keys($_FILES), ['photos'])) respond(400, ['ok' => false, 'code' => 'invalid_payload']);
} elseif (str_starts_with($contentType, 'application/json')) {
    $payload = file_get_contents('php://input', false, null, 0, 32769);
    if (strlen((string)$payload) > 32768) respond(413, ['ok' => false, 'code' => 'payload_too_large']);
} else respond(415, ['ok' => false, 'code' => 'unsupported_content_type']);
$raw = json_decode((string)$payload, true);
if (!is_array($raw)) respond(400, ['ok' => false, 'code' => 'invalid_json']);
if (clean($raw['website'] ?? '', 100) !== '') respond(200, ['ok' => true, 'requestId' => bin2hex(random_bytes(8))]);

$name = clean($raw['name'] ?? '', 80);
$phone = clean($raw['phone'] ?? '', 30);
$email = clean($raw['email'] ?? '', 160);
$appliance = clean($raw['applianceType'] ?? '', 40);
$problem = clean($raw['problem'] ?? '', 1500);
$brand = clean($raw['brand'] ?? '');
$model = clean($raw['model'] ?? '');
$selected = $raw['selectedProblemIds'] ?? [];
$catalogPath = is_file(__DIR__ . '/problems.json') ? __DIR__ . '/problems.json' : __DIR__ . '/../../src/content/problems.json';
$catalog = json_decode((string)file_get_contents($catalogPath), true);
$zip = clean($raw['zipCode'] ?? '', 10);
$preferred = clean($raw['preferredContact'] ?? '', 10);
$bestTime = clean($raw['bestTime'] ?? '', 80);
$consent = ($raw['consent'] ?? false) === true;
$startedAt = (int)($raw['formStartedAt'] ?? 0);
$appliances = ['refrigerator-freezer', 'ice-maker', 'washer-dryer', 'dishwasher-disposal', 'oven-cooktop', 'microwave', 'other'];
$methods = ['call', 'text', 'email'];

$errors = [];
if (mb_strlen($name) < 2 || mb_strlen($name) > 80) $errors['name'] = ['Please enter your name (2–80 characters).'];
if (mb_strlen(preg_replace('/\D+/', '', $phone) ?? '') < 10 || mb_strlen($phone) > 30) $errors['phone'] = ['Please enter a valid phone number.'];
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = ['Please enter a valid email.'];
if ($preferred === 'email' && $email === '') $errors['email'] = ['Email is required for email contact.'];
if (!in_array($appliance, $appliances, true)) $errors['applianceType'] = ['Please choose an appliance.'];
$allowed = array_column($catalog[$appliance] ?? [], 'id');
if (!is_array($selected) || !array_is_list($selected) || count($selected) > 4 || count(array_filter($selected, 'is_string')) !== count($selected)) {
    $errors['selectedProblemIds'] = ['Please choose problems for the selected appliance.'];
    $selected = [];
} elseif (array_diff($selected, $allowed) || count(array_unique($selected)) !== count($selected)) $errors['selectedProblemIds'] = ['Please choose problems for the selected appliance.'];
if ((!count($selected) && mb_strlen($problem) < 10) || mb_strlen($problem) > 1500) $errors['problem'] = ['Select a problem or briefly describe what is happening.'];
if (mb_strlen($brand) > 80) $errors['brand'] = ['Use up to 80 characters.'];
if (mb_strlen($model) > 100) $errors['model'] = ['Use up to 100 characters.'];
if (mb_strlen($bestTime) < 2 || mb_strlen($bestTime) > 80) $errors['bestTime'] = ['Please choose the best time to reach you.'];
if (isset($raw['fallbackToText']) && !is_bool($raw['fallbackToText'])) $errors['fallbackToText'] = ['Invalid choice.'];
if (!preg_match('/^\d{5}(?:-\d{4})?$/', $zip)) $errors['zipCode'] = ['Please enter a valid ZIP code.'];
if (!in_array($preferred, $methods, true)) $errors['preferredContact'] = ['Please choose a contact method.'];
if (!$consent) $errors['consent'] = ['Please confirm we may contact you.'];
if ($startedAt <= 0 || ((int)(microtime(true) * 1000) - $startedAt) < 1800) respond(429, ['ok' => false, 'code' => 'spam_check']);
if ($errors !== []) respond(400, ['ok' => false, 'code' => 'validation', 'fieldErrors' => $errors]);

// Decode, normalize and remove metadata. Never keep public copies of uploads.
$attachments = [];
$uploads = $_FILES['photos'] ?? null;
if ($uploads !== null) {
    if (!is_array($uploads['name'] ?? null)) {
        foreach (['name', 'tmp_name', 'error', 'size', 'type'] as $key) $uploads[$key] = [$uploads[$key] ?? null];
    }
    if (count($uploads['name']) > 3) respond(400, ['ok' => false, 'code' => 'too_many_photos', 'message' => 'You can attach up to 3 photos.']);
    if (!function_exists('imagecreatefromstring') || !class_exists('finfo')) respond(502, ['ok' => false, 'code' => 'delivery_not_configured', 'message' => 'Image processing is not configured.']);
    foreach ($uploads['name'] as $i => $unused) {
        $path = $uploads['tmp_name'][$i] ?? '';
        if (($uploads['error'][$i] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !is_string($path) || !is_uploaded_file($path)) respond(400, ['ok' => false, 'code' => 'invalid_photo', 'message' => 'A photo could not be uploaded.']);
        $size = filesize($path);
        if (!$size || $size > 1000000) respond(400, ['ok' => false, 'code' => 'invalid_photo_size', 'message' => 'Each prepared photo must be under 1 MB.']);
        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($path);
        $info = @getimagesize($path);
        if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp'], true) || $mime !== ($uploads['type'][$i] ?? '') || !$info || $info[0] * $info[1] > 12000000) respond(400, ['ok' => false, 'code' => 'invalid_photo_type', 'message' => 'Please attach valid JPEG, PNG, or WebP photos.']);
        $image = @imagecreatefromstring((string)file_get_contents($path));
        if ($image === false) respond(400, ['ok' => false, 'code' => 'invalid_photo']);
        $scale = min(1, 2400 / max($info[0], $info[1]));
        $resized = imagecreatetruecolor((int)round($info[0] * $scale), (int)round($info[1] * $scale));
        imagefill($resized, 0, 0, imagecolorallocate($resized, 255, 255, 255));
        imagecopyresampled($resized, $image, 0, 0, 0, 0, imagesx($resized), imagesy($resized), $info[0], $info[1]);
        ob_start(); imagejpeg($resized, null, 85); $bytes = (string)ob_get_clean();
        imagedestroy($image); imagedestroy($resized);
        if (!$bytes || strlen($bytes) > 1000000) respond(400, ['ok' => false, 'code' => 'invalid_photo_size']);
        $attachments[] = $bytes;
    }
}

foreach (['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_FROM_EMAIL'] as $setting) if (!getenv($setting)) respond(502, ['ok' => false, 'code' => 'delivery_not_configured', 'message' => 'Email delivery is not configured yet.']);

$autoload = __DIR__ . '/vendor/autoload.php';
if (!is_file($autoload)) respond(502, ['ok' => false, 'code' => 'delivery_not_configured', 'message' => 'Mail library is not installed.']);
require $autoload;

$requestId = bin2hex(random_bytes(8));
$body = "New Appliance RS callback request ({$requestId})\n\nName: {$name}\nPhone: {$phone}\nEmail: " . ($email ?: 'Not provided') . "\nAppliance: {$appliance}\nZIP: {$zip}\nPreferred contact: {$preferred}\nBest time: {$bestTime}\nText fallback: " . (($raw['fallbackToText'] ?? false) ? 'Yes' : 'No') . "\n\nProblem:\n{$problem}";
$labels = array_column(array_filter($catalog[$appliance] ?? [], fn($item) => in_array($item['id'], $selected, true)), 'label');
$body .= "\n\nBrand: " . ($brand ?: 'Not provided') . "\nModel: " . ($model ?: 'Not provided') . "\nSelected problems: " . (implode('; ', $labels) ?: 'None selected');

try {
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = (string)getenv('SMTP_HOST');
    $mail->Port = (int)(getenv('SMTP_PORT') ?: 587);
    $mail->SMTPAuth = true;
    $mail->Username = (string)getenv('SMTP_USER');
    $mail->Password = (string)getenv('SMTP_PASS');
    $mail->SMTPSecure = $mail->Port === 465 ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->setFrom((string)getenv('CONTACT_FROM_EMAIL'), 'Appliance RS Website');
    $mail->addAddress((string)(getenv('CONTACT_TO_EMAIL') ?: 'appliansersl@gmail.com'));
    if ($email !== '') $mail->addReplyTo($email, $name);
    $mail->Subject = "Appliance RS service request - {$appliance} - " . substr($requestId, 0, 8);
    $mail->Body = $body;
    $mail->CharSet = 'UTF-8';
    foreach ($attachments as $i => $bytes) $mail->addStringAttachment($bytes, 'appliance-photo-' . ($i + 1) . '.jpg', 'base64', 'image/jpeg');
    $mail->send();
    respond(200, ['ok' => true, 'requestId' => $requestId]);
} catch (Throwable $error) {
    respond(502, ['ok' => false, 'code' => 'delivery_failed', 'message' => 'We could not deliver the request right now.']);
}
