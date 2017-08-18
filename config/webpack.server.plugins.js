const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
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

module.exports = [
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
