// utils/encryption.js
const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32); // Use a secure, consistent key in production
const iv = crypto.randomBytes(16); // Random initialization vector (IV)

// Encrypts a given text using AES
function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encryptedData: encrypted, iv: iv.toString("hex") };
}

// Decrypts the encrypted data back to the original text
function decrypt(encrypted, ivHex) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encrypt, decrypt };
