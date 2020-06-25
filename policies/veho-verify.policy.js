const crypto = require('crypto');

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
      try {
        const foundApiKey = apikeys.some((apikey) => {
          const timestamp = req.headers['x-veho-time'];
          const hash = crypto.createHmac('SHA256', apikey);
          hash.update(`${timestamp}.${JSON.stringify(req.body)}`);
          if (req.headers['x-veho-hmac-sha256'] === hash.digest('hex')) {
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
    };
  }
};
