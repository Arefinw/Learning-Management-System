// In craco.config.js

const path = require('path');

module.exports = {
  webpack: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
    },
    configure: (webpackConfig, { env, paths }) => {
      // Find the ModuleScopePlugin and remove it.
      // This plugin is what prevents imports from outside the src/ directory.
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      );

      if (scopePluginIndex > -1) {
        webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      }

      return webpackConfig;
    },
  },
};