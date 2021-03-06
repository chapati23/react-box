const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const paths = require('./paths')

// https://webpack.js.org/configuration/resolve/
module.exports = {
  /*
   * These are the reasonable defaults supported by the Node ecosystem.
   * We also include JSX as a common component filename extension to support
   * some tools, although we do not recommend using it, see:
   * https://github.com/facebookincubator/create-react-app/issues/290
   * `web` extension prefixes have been added for better support
   * for React Native Web.
   * https://webpack.js.org/configuration/resolve/#resolve-extensions
   */
  extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx', '.css'],

  // https://webpack.js.org/configuration/resolve/#resolve-alias
  alias: {
    /*
     * Support React Native Web
     * https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
     */
    'react-native': 'react-native-web'
  },

  // https://webpack.js.org/configuration/resolve/#resolve-plugins
  plugins: [
    /*
     * Prevents users from importing files from outside of src/ (or node_modules/).
     * This often causes confusion because we only process files within src/ with babel.
     * To fix this, we prevent you from importing files out of src/ -- if you'd like to,
     * please link the files into your node_modules/ and let module-resolution kick in.
     * Make sure your source files are compiled, as they will not be processed in any way.
     */
    new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])
  ]
}
