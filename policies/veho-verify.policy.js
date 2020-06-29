const crypto = require('crypto');

module.exports = {
  name: 'veho-verify',
  schema: {
    $id: 'N/A',
    type: 'object',
    properties: {
      apikeys: {
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
        if (!foundApiKey) {
          res.sendStatus(401);
          return;
        };
      } catch (e) {
        console.error('Error in veho-verify policy:', e.error);
        res.sendStatus(500);
        return;
      }
      next();
    };
  }
};
