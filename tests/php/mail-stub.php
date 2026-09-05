<?php
// Test-only transport. NEVER include this file in a hosting package.
namespace PHPMailer\PHPMailer;
#[\AllowDynamicProperties]
class PHPMailer {
    const ENCRYPTION_SMTPS = 'ssl';
    const ENCRYPTION_STARTTLS = 'tls';
    public array $attachments = [];
    public function __construct(bool $exceptions = false) {}
    public function isSMTP(): void {}
    public function setFrom(string $email, string $name = ''): void {}
    public function addAddress(string $email): void {}
    public function addReplyTo(string $email, string $name = ''): void {}
    public function addStringAttachment(string $bytes, string $name, string $encoding, string $mime): void {
        $this->attachments[] = ['size' => strlen($bytes), 'name' => $name, 'mime' => $mime];
    }
    public function send(): bool {
        file_put_contents((string)getenv('TEST_MAIL_CAPTURE'), json_encode(['body' => $this->Body, 'attachments' => $this->attachments]));
        if (str_contains($this->Body, 'FAIL_MAIL')) throw new \RuntimeException('Controlled failure');
        return true;
    }
}
