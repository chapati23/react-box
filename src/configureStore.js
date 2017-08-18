import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction'
import { connectRoutes } from 'redux-first-router'
import restoreScroll from 'redux-first-router-restore-scroll'
import { persistStore, autoRehydrate } from 'redux-persist'
import CookieStorage from 'redux-persist-cookie-storage'
import reducers from './reducers'

import isServer from './utils/isServer'
import routesMap from './routesMap'

export default (history, preLoadedState) => {
  const {
    reducer,
    middleware,
    enhancer,
    thunk
  } = connectRoutesWithScrollRestoration(history, routesMap)

  const rootReducer = combineReducers({ ...reducers, location: reducer })
  const middlewares = applyMiddleware(middleware)
  const enhancers = composeEnhancers(enhancer, middlewares, autoRehydrate())
  const store = createStore(rootReducer, preLoadedState, enhancers)

  if (!isServer) {
    persistStore(store, {
      blacklist: ['location', 'page', 'direction'],
      storage: new CookieStorage()
    })
  }

  if (module.hot && process.env.NODE_ENV === 'development') {
    module.hot.accept('./reducers.js', () => {
      const reducers = require('./reducers') // eslint-disable-line global-require
      const rootReducer = combineReducers({ ...reducers, location: reducer })
      store.replaceReducer(rootReducer)
    })
  }

  return { store, thunk }
}

const composeEnhancers = (...args) =>
  isServer ? compose(...args) : composeWithDevTools({ maxAge: 20 })(...args)

const connectRoutesWithScrollRestoration = (history, routesMap) =>
  isServer
    ? connectRoutes(history, routesMap)
    : connectRoutes(history, routesMap, {
        restoreScroll: restoreScroll({ shouldUpdateScroll: () => true })
      })
