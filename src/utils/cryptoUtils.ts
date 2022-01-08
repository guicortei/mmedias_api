import crp from 'crypto';

const secret_key = 'asdasdasd';
const secret_iv = 'smslt';
const encryptionMethod = 'AES-256-CBC';
const secret = crp
  .createHash('sha512')
  .update(secret_key, 'utf-8')
  .digest('hex')
  .substr(0, 32);
const iv = crp
  .createHash('sha512')
  .update(secret_iv, 'utf-8')
  .digest('hex')
  .substr(0, 16);

export function encrypt_string(plain_text) {
  const encryptor = crp.createCipheriv(encryptionMethod, secret, iv);
  const aes_encrypted =
    encryptor.update(plain_text, 'utf8', 'base64') + encryptor.final('base64');
  return Buffer.from(aes_encrypted).toString('base64');
}

export function decrypt_string(encryptedMessage) {
  const buff = Buffer.from(encryptedMessage, 'base64');
  const str = buff.toString('utf-8');
  const decryptor = crp.createDecipheriv(encryptionMethod, secret, iv);
  return decryptor.update(str, 'base64', 'utf8') + decryptor.final('utf8');
}
