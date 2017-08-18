import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import AppContainer from 'react-hot-loader/lib/AppContainer'
import createHistory from 'history/createBrowserHistory'
import App from './App'
import configureStore from './configureStore'

const history = createHistory()
const { store } = configureStore(history, window.REDUX_STATE)

const render = App => {
  const root = document.getElementById('root')

  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <App />
      </Provider>
    </AppContainer>,
    root
  )
}

render(App)

if (module.hot && process.env.NODE_ENV === 'development') {
  module.hot.accept('./App', () => {
    const App = require('./App').default
    render(App)
  })
}
