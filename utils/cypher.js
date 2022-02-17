// OMG CYPHER FROM VALORANT?!?!? REAL!!!!!

import config from '../config.js';
import crypto from 'crypto';

const algorithm = 'aes-256-ctr';
const secretKey = config.salt_key || "lu3kissofuckingc00lomg!heisn1ce2";
const iv = crypto.randomBytes(16);

export const encrypt = function decrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

export const decrypt = function decrypt(iv, content) {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);
    return decrpyted.toString();
};