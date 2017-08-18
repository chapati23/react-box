const fs = require('fs')
const webpack = require('webpack')

// Plugins
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')

// Helpers
const loaders = require('./webpack.server.loaders')
const resolvers = require('./webpack.resolvers')
const getClientEnvironment = require('./env')
const paths = require('./paths')

/*
 * `publicUrl` is just like `publicPath`, but we will provide it to our app
 * as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
 * Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
 */
const publicUrl = ''

// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl)

/*
 * If you're specifying externals to leave unbundled, you need to tell webpack
 * to still bundle `react-universal-component`, `webpack-flush-chunks` and
 * `require-universal-module` so that they know they are running
 * within Webpack and can properly make connections to client modules:
 */
const externals = fs
  .readdirSync(paths.appNodeModules)
  .filter(
    x =>
      !/\.bin|react-universal-component|require-universal-module|webpack-flush-chunks/.test(
        x
      )
  )
  .reduce((externals, mod) => {
    externals[mod] = `commonjs ${mod}`
    return externals
  }, {})

module.exports = {
  name: 'server',
  target: 'node',
  devtool: 'eval',
  entry: ['babel-polyfill', 'fetch-everywhere', paths.appServerRender],
  externals,
  output: {
    path: paths.appBuildServer,
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    publicPath: '/static/'
  },
  module: {
    rules: loaders
  },
  resolve: resolvers,
  plugins: [
    /*
     * CAREFUL: THE PLUGIN ORDER MATTERS!!
     * Plugins are bound to the compiler and applied in the order specified
     */

    /*
     * While writing your code, you may have already added many code split points
     * to load stuff on demand. After compiling you might notice that some chunks
     * are too small - creating larger HTTP overhead. Luckily, this plugin can
     * post-process your chunks by merging them.
     * https://webpack.js.org/plugins/limit-chunk-count-plugin/
     */
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),

    /*
     * Makes some environment variables available to the JS code, for example:
     * if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
     * https://webpack.js.org/plugins/define-plugin/
     */
    new webpack.DefinePlugin(env.stringified),

    /*
     * Copy individual files or entire directories to the build directory.
     * https://github.com/kevlened/copy-webpack-plugin
     */
    new CopyWebpackPlugin([
      {
        from: paths.appFavicons,
        to: 'favicons'
      }
    ]),

    /*
     * Generates an asset manifest.
     * https://github.com/danethurber/webpack-manifest-plugin
     */
    new ManifestPlugin({ fileName: 'manifest.json' })
  ]
}
