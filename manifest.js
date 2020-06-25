module.exports = {
  version: '1.2.3',
  init: (pluginContext) => {
     pluginContext.registerPolicy(require('./policies/veho-verify.policy'))
  },
  policies: ['veho-verify'],
  schema: {
    $id: 'N/A',
  }
}
