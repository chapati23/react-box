const fs = require('fs')

// Helpers
const loaders = require('./webpack.server.loaders')
const resolvers = require('./webpack.resolvers')
const plugins = require('./webpack.server.plugins')
const paths = require('./paths')

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
  entry: ['fetch-everywhere', paths.appServerRender],
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
  plugins
}
