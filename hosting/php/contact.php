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
    return mb_substr(trim(is_string($value) ? $value : ''), 0, $max);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, ['ok' => false, 'code' => 'method_not_allowed']);
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 32768) respond(413, ['ok' => false, 'code' => 'payload_too_large']);

$raw = json_decode((string)file_get_contents('php://input'), true);
if (!is_array($raw)) respond(400, ['ok' => false, 'code' => 'invalid_json']);
if (clean($raw['website'] ?? '', 100) !== '') respond(200, ['ok' => true, 'requestId' => bin2hex(random_bytes(8))]);

$name = clean($raw['name'] ?? '', 80);
$phone = clean($raw['phone'] ?? '', 30);
$email = clean($raw['email'] ?? '', 160);
$appliance = clean($raw['applianceType'] ?? '', 40);
$problem = clean($raw['problem'] ?? '', 1500);
$zip = clean($raw['zipCode'] ?? '', 10);
$preferred = clean($raw['preferredContact'] ?? '', 10);
$bestTime = clean($raw['bestTime'] ?? '', 80);
$consent = ($raw['consent'] ?? false) === true;
$startedAt = (int)($raw['formStartedAt'] ?? 0);
$appliances = ['refrigerator-freezer', 'ice-maker', 'washer-dryer', 'dishwasher-disposal', 'oven-cooktop', 'microwave', 'other'];
$methods = ['call', 'text', 'email'];

$errors = [];
if (mb_strlen($name) < 2) $errors['name'] = ['Please enter your name.'];
if (mb_strlen(preg_replace('/\D+/', '', $phone) ?? '') < 10) $errors['phone'] = ['Please enter a valid phone number.'];
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = ['Please enter a valid email.'];
if ($preferred === 'email' && $email === '') $errors['email'] = ['Email is required for email contact.'];
if (!in_array($appliance, $appliances, true)) $errors['applianceType'] = ['Please choose an appliance.'];
if (mb_strlen($problem) < 10) $errors['problem'] = ['Please briefly describe the problem.'];
if (!preg_match('/^\d{5}(?:-\d{4})?$/', $zip)) $errors['zipCode'] = ['Please enter a valid ZIP code.'];
if (!in_array($preferred, $methods, true)) $errors['preferredContact'] = ['Please choose a contact method.'];
if (!$consent) $errors['consent'] = ['Please confirm we may contact you.'];
if ($startedAt <= 0 || ((int)(microtime(true) * 1000) - $startedAt) < 1800) respond(429, ['ok' => false, 'code' => 'spam_check']);
if ($errors !== []) respond(400, ['ok' => false, 'code' => 'validation', 'fieldErrors' => $errors]);

$autoload = __DIR__ . '/vendor/autoload.php';
if (!is_file($autoload)) respond(502, ['ok' => false, 'code' => 'delivery_not_configured', 'message' => 'Mail library is not installed.']);
require $autoload;

$requestId = bin2hex(random_bytes(8));
$body = "New Appliance RS callback request ({$requestId})\n\nName: {$name}\nPhone: {$phone}\nEmail: " . ($email ?: 'Not provided') . "\nAppliance: {$appliance}\nZIP: {$zip}\nPreferred contact: {$preferred}\nBest time: {$bestTime}\nText fallback: " . (($raw['fallbackToText'] ?? false) ? 'Yes' : 'No') . "\n\nProblem:\n{$problem}";

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
    $mail->send();
    respond(200, ['ok' => true, 'requestId' => $requestId]);
} catch (Throwable $error) {
    respond(502, ['ok' => false, 'code' => 'delivery_failed', 'message' => 'We could not deliver the request right now.']);
}
