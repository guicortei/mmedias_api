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
const salt_bytes_size = 4;

export function encrypt_string(plain_text) {
  let str_to_encrypt = plain_text;
  str_to_encrypt += crp.randomBytes(salt_bytes_size).toString('hex');
  const encryptor = crp.createCipheriv(encryptionMethod, secret, iv);
  const aes_encrypted =
    encryptor.update(str_to_encrypt, 'utf8', 'base64') +
    encryptor.final('base64');
  const encrypted = Buffer.from(aes_encrypted).toString('base64');
  // console.log(`${plain_text} --> ${encrypted}`);
  return encrypted;
}

export function decrypt_string(encryptedMessage) {
  const buff = Buffer.from(encryptedMessage, 'base64');
  const str = buff.toString('utf-8');
  const decryptor = crp.createDecipheriv(encryptionMethod, secret, iv);
  const decrypted_with_salt =
    decryptor.update(str, 'base64', 'utf8') + decryptor.final('utf8');
  const len_of_salt_hash = crp
    .randomBytes(salt_bytes_size)
    .toString('hex').length;
  const decrypted = decrypted_with_salt.substring(
    0,
    decrypted_with_salt.length - len_of_salt_hash,
  );
  // console.log(`${decrypted} <-- ${encryptedMessage}`);
  return decrypted;
}
