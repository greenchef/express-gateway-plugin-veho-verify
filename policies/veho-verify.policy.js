const crypto = require('crypto');
const express = require('express');
const jsonParser = require('express').json();
const urlEncodedParser = require('express').urlEncoded({ extended: true });

module.exports = {
  name: 'veho-verify',
  schema: {
    $id: 'N/A',
    type: 'object',
    properties: {
      ipList: {
        type: 'array',
      }
    }
  },
  policy: ({ apikeys }) => {
    return async (req, res, next) => {
      const x = (req, res, next) => {
        try {
          const foundApiKey = apikeys.some((apikey) => {
            console.log("apikey", apikey)
            const timestamp = req.headers['x-veho-time'];
            console.log("timestamp", timestamp)
            const hash = crypto.createHmac('SHA256', apikey);
            hash.update(`${timestamp}.${JSON.stringify(req.body)}`);
            const hashDigest = hash.digest('hex');
            console.log("req.body", req.body)
            console.log("hashDigest", hashDigest)
            if (req.headers['x-veho-hmac-sha256'] === hashDigest) {
              return true;
            }
            return false;
          });
          foundApiKey ? console.log(' Veho Signature was verified') : console.error(' Veho Signature was not verified');
        } catch (e) {
          console.error('Error in veho-verify policy:', e.error);
          return;
        }
        next();
      }
      jsonParser(req, res, () => urlEncoded(req, res, x));
    };
  }
};
