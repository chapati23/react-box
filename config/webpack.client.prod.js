const path = require('path')
const webpack = require('webpack')

// Plugins
const AutoDllPlugin = require('autodll-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const StatsPlugin = require('stats-webpack-plugin')

// Helpers
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

module.exports = {
  name: 'client',
  target: 'web',
  devtool: 'source-map',
  entry: ['babel-polyfill', 'fetch-everywhere', paths.appIndexJs],
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: paths.appBuildClient,
    publicPath: '/static/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ExtractCssChunks.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                camelCase: true,
                importLoaders: 1,
                modules: true,
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
            },
            'resolve-url-loader',
            'postcss-loader?sourceMap'
          ]
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      },
      {
        test: /\.(pdf)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  },
  resolve: resolvers,
  plugins: [
    /*
     * CAREFUL: THE PLUGIN ORDER MATTERS!!
     * Plugins are bound to the compiler and applied in the order specified
     */

    /*
     * This plugin will ingest the webpack stats object, process and transform
     * the object and write out to a file for further consumption.
     * https://github.com/FormidableLabs/webpack-stats-plugin
     */
    new StatsPlugin('stats.json'),

    /*
     * Like extract-text-webpack-plugin, but creates multiple css files (one per chunk).
     * Then, as part of server side rendering, you can deliver just the css chunks needed
     * by the current request. The result is the most minimal CSS initially served compared
     * to emerging "render path" solutions.
     * https://github.com/faceyspacey/extract-css-chunks-webpack-plugin
     */
    new ExtractCssChunks(),

    /*
     * The CommonsChunkPlugin is an opt-in feature that creates a separate file (known as a chunk),
     * consisting of common modules shared between multiple entry points. By separating common
     * modules from bundles, the resulting chunked file can be loaded once initially, and stored
     * in cache for later use. This results in pagespeed optimizations as the browser can quickly
     * serve the shared code from cache, rather than being forced to load a larger bundle whenever
     * a new page is visited.
     * https://webpack.js.org/plugins/commons-chunk-plugin/
     */
    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'], // needed to put webpack bootstrap code before chunks
      filename: '[name].[chunkhash].js',
      minChunks: Infinity
    }),

    /*
     * Makes some environment variables available to the JS code, for example:
     * if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
     * https://webpack.js.org/plugins/define-plugin/
     */
    new webpack.DefinePlugin(env.stringified),

    /*
     * Minifies JS output
     * https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
     */
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        screw_ie8: true,
        comments: false
      },
      sourceMap: true
    }),

    /*
     * This plugin will cause hashes to be based on the relative path of the module,
     * generating a four character string as the module id. Suggested for use in production.
     * https://webpack.js.org/plugins/hashed-module-ids-plugin/
     */
    new webpack.HashedModuleIdsPlugin(),

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
    new ManifestPlugin({ fileName: 'manifest.json' }),

    /*
     * Webpack's DllPlugin without the boilerplate
     * https://github.com/asfktz/autodll-webpack-plugin
     */
    new AutoDllPlugin({
      context: path.join(__dirname, '..'),
      filename: '[name].js',
      entry: {
        vendor: [
          'react',
          'react-dom',
          'react-redux',
          'redux',
          'history/createBrowserHistory',
          'transition-group',
          'redux-first-router',
          'redux-first-router-link',
          'fetch-everywhere',
          'babel-polyfill',
          'redux-devtools-extension/logOnlyInProduction'
        ]
      }
    })
  ]
}
