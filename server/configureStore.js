import createHistory from 'history/createMemoryHistory'
import { NOT_FOUND } from 'redux-first-router'
import configureStore from '../src/configureStore'

const doesRedirect = ({ kind, pathname }, res) => {
  if (kind === 'redirect') {
    res.redirect(302, pathname)
    return true
  }
  return false
}

export default async (req, res) => {
  /*
   * preLoadedState is useful for e.g. authenticating requests with JSON Web Tokens:
   */
  const cookies = req.cookies
  const parsedCookies = {}
  const whitelistedReducers = []

  Object.entries(cookies).forEach(([key, value]) => {
    const decodedKey = decodeURIComponent(key)
    const keyWithoutReduxPersistPrefix = decodedKey.replace(/reduxPersist:/, '')
    if (whitelistedReducers.includes(keyWithoutReduxPersistPrefix)) {
      parsedCookies[keyWithoutReduxPersistPrefix] = JSON.parse(value)
    }
  })
  const preLoadedState = { ...parsedCookies } // onBeforeChange will authenticate using this

  // match initial route to express path
  const history = createHistory({ initialEntries: [req.path] })
  const { store, thunk } = configureStore(history, preLoadedState)

  let location = store.getState().location
  if (doesRedirect(location, res)) return false

  // if there is a thunk in the routesMap for the current route it will be awaited here
  await thunk(store)

  // re-assign location because state might have changed due to thunks being dispatched
  location = store.getState().location
  if (doesRedirect(location, res)) return false // only do this again if ur thunks have redirects

  const status = location.type === NOT_FOUND ? 404 : 200
  res.status(status)
  return store
}
