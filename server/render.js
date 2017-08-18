import React from 'react'
import ReactDOM from 'react-dom/server'
import { Provider } from 'react-redux'
import { flushChunkNames } from 'react-universal-component/server'
import flushChunks from 'webpack-flush-chunks'
import serialize from 'serialize-javascript'
import configureStore from './configureStore'
import App from '../src/App'

export default ({ clientStats }) => async (req, res) => {
  const store = await configureStore(req, res)
  if (!store) return // no store means redirect was already served

  const app = createApp(App, store)
  const appString = ReactDOM.renderToString(app)
  const stateJson = serialize(store.getState(), { isJSON: true })
  const chunkNames = flushChunkNames()
  const { js, styles, cssHash } = flushChunks(clientStats, { chunkNames })

  const googleAnalyticsSnippet = `<script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-45243821-7', 'auto');
      ga('send', 'pageview');

    </script>
  `

  const pingdomSnippet = `<script>
    var _prum = [['id', '5981c4bea83408d0b8a6d223'],
                 ['mark', 'firstbyte', (new Date()).getTime()]];
    (function() {
        var s = document.getElementsByTagName('script')[0]
          , p = document.createElement('script');
        p.async = 'async';
        p.src = '//rum-static.pingdom.net/prum.min.js';
        s.parentNode.insertBefore(p, s);
    })();
    </script>
  `

  /* eslint-disable no-console */
  console.log('REQUESTED PATH:', req.path)
  console.log('CHUNK NAMES', chunkNames)
  /* eslint-enable */

  /* eslint-disable consistent-return */
  return res.send(
    `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
          <meta name="description" content="The future of stock trading on the blockchain">
          <meta name="keywords" content="brickblock,crypto,ethereum,blockchain,trading,ETFs,REFs">
          <meta name="author" content="Brickblock Ltd">
          <meta http-equiv="cleartype" content="on">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="theme-color" content="#172c81">
          <title>Brickblock.io | Token Sale</title>
          ${styles}
          <link rel="apple-touch-icon" sizes="57x57"         href="/static/favicons/apple-icon-57x57.png">
          <link rel="apple-touch-icon" sizes="60x60"         href="/static/favicons/apple-icon-60x60.png">
          <link rel="apple-touch-icon" sizes="72x72"         href="/static/favicons/apple-icon-72x72.png">
          <link rel="apple-touch-icon" sizes="76x76"         href="/static/favicons/apple-icon-76x76.png">
          <link rel="apple-touch-icon" sizes="114x114"       href="/static/favicons/apple-icon-114x114.png">
          <link rel="apple-touch-icon" sizes="120x120"       href="/static/favicons/apple-icon-120x120.png">
          <link rel="apple-touch-icon" sizes="144x144"       href="/static/favicons/apple-icon-144x144.png">
          <link rel="apple-touch-icon" sizes="152x152"       href="/static/favicons/apple-icon-152x152.png">
          <link rel="apple-touch-icon" sizes="180x180"       href="/static/favicons/apple-icon-180x180.png">
          <link rel="icon" type="image/png" sizes="192x192"  href="/static/favicons/android-icon-192x192.png">
          <link rel="icon" type="image/png" sizes="32x32"    href="/static/favicons/favicon-32x32.png">
          <link rel="icon" type="image/png" sizes="96x96"    href="/static/favicons/favicon-96x96.png">
          <link rel="icon" type="image/png" sizes="16x16"    href="/static/favicons/favicon-16x16.png">
          <meta name="msapplication-TileColor" content="#172c81">
          <meta name="msapplication-TileImage" content="ms-icon-144x144.png">
          <link rel="manifest" href="/static/manifest.json">
          ${process.env.NODE_ENV === 'production' ? googleAnalyticsSnippet : ''}
          ${process.env.NODE_ENV === 'production' ? pingdomSnippet : ''}
        </head>
        <body>
          <script>window.REDUX_STATE = ${stateJson}</script>
          <div id="root">${appString}</div>
          ${cssHash}
          <script type='text/javascript' src='/static/vendor.js'></script>
          ${js}
        </body>
      </html>`
  )
  /* eslint-enable */
}

const createApp = (App, store) =>
  <Provider store={store}>
    <App />
  </Provider>
