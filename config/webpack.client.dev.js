const path = require('path')
const webpack = require('webpack')

// Plugins
const AutoDllPlugin = require('autodll-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const EslintFormatter = require('react-dev-utils/eslintFormatter')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')
const WriteFilePlugin = require('write-file-webpack-plugin')

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

  // https://webpack.js.org/configuration/target/
  target: 'web',

  // https://webpack.js.org/configuration/devtool/
  devtool: 'cheap-module-eval-source-map',

  // https://webpack.js.org/configuration/entry-context/#entry
  entry: [
    'babel-polyfill',
    'fetch-everywhere',
    'react-error-overlay', // Errors should be considered fatal in development
    'react-hot-loader/patch',
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false',
    paths.appIndexJs
  ],

  // https://webpack.js.org/configuration/output/
  output: {
    /*
     * This does not produce a real file. It's just the virtual path that is
     * served by WebpackDevServer in development. This is the JS bundle
     * containing code from all our entry points, and the Webpack runtime.
     * https://webpack.js.org/configuration/output/#output-filename
     */
    filename: '[name].js',

    /*
     * There are also additional JS chunk files if you use code splitting.
     * https://webpack.js.org/configuration/output/#output-chunkfilename
     */
    chunkFilename: '[name].js',

    /*
     * Add filename comments to generated require()s in the output.
     * https://webpack.js.org/configuration/output/#output-pathinfo
     */
    pathinfo: true,

    /*
     * The output directory as an absolute path
     * https://webpack.js.org/configuration/output/#output-path
     */
    path: paths.appBuildClient,

    // https://webpack.js.org/configuration/output/#output-publicpath
    publicPath: '/static/',

    /*
     * Point sourcemap entries to original disk location (format as URL on Windows)
     * https://webpack.js.org/configuration/output/#output-devtoolmodulefilenametemplate
     */
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
  },

  resolve: resolvers,

  // https://webpack.js.org/configuration/module/
  module: {
    // https://webpack.js.org/configuration/module/#rule-rules
    rules: [
      /*
       * First, run the linter.
       * It's important to do this before Babel processes the JS.
       */
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: EslintFormatter,
              eslintPath: 'eslint'
            },
            loader: 'eslint-loader'
          }
        ],
        include: paths.appSrc
      },
      {
        /*
         * "oneOf" will traverse all following loaders until one will
         * match the requirements. When no loader matches it will fall
         * back to the "file" loader at the end of the loader list.
         * https://webpack.js.org/configuration/module/#rule-oneof
         */
        oneOf: [
          /*
           * The url-loader works like the file-loader except that it embeds assets
           * smaller than the specified limit in bytes as data URLs to avoid requests.
           * A missing `test` is equivalent to a match.
           */
          {
            test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]'
            }
          },

          // Process JS with Babel.
          {
            test: /\.(js|jsx)$/,
            include: paths.appSrc,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              /*
               * This is a feature of `babel-loader` for webpack (not Babel itself).
               * It enables caching results in ./node_modules/.cache/babel-loader/
               * directory for faster rebuilds.
               */
              cacheDirectory: true
            }
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

          /*
           * The file-loader makes sure those assets get served by WebpackDevServer.
           * When you `import` an asset, you get its (virtual) filename.
           * In production, they would get copied to the `build` folder.
           * This loader don't uses a "test" so it will catch all modules
           * that fall through the other loaders.
           */
          {
            test: /\.(pdf)$/,
            loader: 'file-loader',
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    /*
     * CAREFUL: THE PLUGIN ORDER MATTERS!!
     * Plugins are bound to the compiler and applied in the order specified
     */

    /*
     * Forces webpack-dev-server program to write bundle files to the
     * file system and shows what chunks are produced in dev
     * https://github.com/gajus/write-file-webpack-plugin
     */
    new WriteFilePlugin(),

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
      filename: '[name].js',
      minChunks: Infinity
    }),

    /*
     * Hot Module Replacement (HMR) exchanges, adds, or removes modules while an application
     * is running, without a full reload. This can significantly speed up development in a few ways:
     * - Retain application state which is lost during a full reload.
     * - Save valuable development time by only updating what's changed.
     * - Tweak styling faster -- almost comparable to changing styles in the browser's debugger.
     * https://webpack.js.org/plugins/hot-module-replacement-plugin/
     */
    new webpack.HotModuleReplacementPlugin(),

    /*
     * Skips the emitting phase whenever there are errors while compiling.
     * This ensures that no assets are emitted that include errors.
     * The emitted flag in the stats is false for all assets.
     * https://webpack.js.org/plugins/no-emit-on-errors-plugin/
     */
    new webpack.NoEmitOnErrorsPlugin(),

    /*
     * Makes some environment variables available to the JS code, for example:
     * if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
     * https://webpack.js.org/plugins/define-plugin/
     */
    new webpack.DefinePlugin(env.stringified),

    /*
     * Watcher doesn't work well if you mistype casing in a path so we use
     * a plugin that prints an error when you attempt to do this.
     * See https://github.com/facebookincubator/create-react-app/issues/240
     *
     * https://github.com/Urthen/case-sensitive-paths-webpack-plugin
     */
    new CaseSensitivePathsPlugin(),

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
     * Add module names to factory functions so they appear in browser profiler.
     * https://webpack.js.org/plugins/named-modules-plugin/
     */
    new webpack.NamedModulesPlugin(),

    /*
     * Generates an asset manifest.
     * https://github.com/danethurber/webpack-manifest-plugin
     */
    new ManifestPlugin({ fileName: 'manifest.json' }),

    /*
     * Moment.js is an extremely popular library that bundles large locale files
     * by default due to how Webpack interprets its code. This is a practical
     * solution that requires the user to opt into importing specific locales.
     * https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
     * You can remove this if you don't use Moment.js
     *
     * https://webpack.js.org/plugins/ignore-plugin/
     */
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    /*
     * If you require a missing module and then `npm install` it, you still have
     * to restart the development server for Webpack to discover it. This plugin
     * makes the discovery automatic so you don't have to restart.
     * See https://github.com/facebookincubator/create-react-app/issues/186
     */
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),

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
