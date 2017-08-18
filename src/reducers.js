import { page, direction } from './pages/page.reducer'

// NOTE: This reducer is mainly for the "devTools." Don't worry that it
// does some weird things. The reason is:
// Since we have SSR, we don't want these actions displayed in HTML
// or checksums won't match up since the server doesnt have them,
// but usually you don't send an array of actions over the wire.

export const actions = (state = [], action = {}) => {
  if (action.type === '@@redux/INIT' || action.type === '@@INIT') {
    return state
  }

  return [action, ...state]
}

export default {
  actions,
  page,
  direction
}
