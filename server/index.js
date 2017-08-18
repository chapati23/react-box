/* eslint-disable no-console */
/* console is fine for server output */

import 'babel-polyfill'

// Express
import express from 'express'
import webpack from 'webpack'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import csp from 'helmet-csp'

// Webpack
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackHotServerMiddleware from 'webpack-hot-server-middleware'
import clientConfig from '../config/webpack.client.dev'
import serverConfig from '../config/webpack.server.dev'

// DX Helpers
import chalk from 'chalk'
import clearConsole from 'react-dev-utils/clearConsole'
import { choosePort } from 'react-dev-utils/WebpackDevServerUtils'

const paths = require('../config/paths')
const DEV = process.env.NODE_ENV === 'development'
const isInteractive = process.stdout.isTTY
const publicPath = clientConfig.output.publicPath
const outputPath = clientConfig.output.path
const app = express()

const shouldCompress = req => {
  const reg = /MSIE [1-6]\./g
  return !reg.test(req.headers['user-agent'])
}

app.use(cookieParser())

app.use(
  compression({
    level: 9,
    threshold: '1kb',
    filter: shouldCompress
  })
)
app.use(
  csp({
    directives: {
      fontSrc: ["'self'", 'data:']
    }
  })
)

// UNIVERSAL HMR + STATS HANDLING GOODNESS:
if (DEV) {
  const multiCompiler = webpack([clientConfig, serverConfig])
  const clientCompiler = multiCompiler.compilers[0]

  app.use(webpackDevMiddleware(multiCompiler, { publicPath }))
  app.use(webpackHotMiddleware(clientCompiler))
  app.use(
    // keeps serverRender updated with arg: { clientStats, outputPath }
    webpackHotServerMiddleware(multiCompiler, {
      serverRendererOptions: { outputPath }
    })
  )
} else {
  const clientStats = require(`${paths.appBuildClient}/stats.json`) // eslint-disable-line import/no-unresolved, global-require
  const serverRender = require(`${paths.appBuildServer}/main.js`).default // eslint-disable-line import/no-unresolved, global-require

  const oneDay = 86400000
  app.use(
    publicPath,
    express.static(outputPath, { maxAge: oneDay, etag: false })
  )
  app.use(serverRender({ clientStats, outputPath }))
}

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 8080
const HOST = process.env.HOST || '0.0.0.0'

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `detect()` Promise resolves to the next free port.
choosePort(HOST, DEFAULT_PORT)
  .then(port => {
    if (port == null) {
      // We have not found a port.
      return
    }

    app.listen(port, HOST, error => {
      if (error) {
        return console.log(chalk.red(error))
      }
      if (isInteractive) {
        clearConsole()
      }
      console.log(chalk.green(`Listening @ http://localhost:${port}/`))
    })
  })
  .catch(error => {
    if (error && error.message) {
      console.log(chalk.red(error.message))
    }
    process.exit(1)
  })
