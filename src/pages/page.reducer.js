// @flow
import { NOT_FOUND } from 'redux-first-router'

export const direction = (state: string = 'next', action: any = {}) => {
  if (!action.meta || !action.meta.location) {
    return state
  }

  const type = action.type
  const prevType = action.meta.location.prev.type

  if (type === prevType) {
    return state
  }
  if (type === 'OVERVIEW') {
    return 'back'
  } else if (type === 'INVEST' && prevType === 'OVERVIEW') {
    return 'next'
  } else if (type === 'INVEST' && prevType === 'PORTFOLIO') {
    return 'back'
  } else if (type === 'PORTFOLIO' && prevType === 'OVERVIEW') {
    return 'next'
  } else if (type === 'PORTFOLIO' && prevType === 'INVEST') {
    return 'next'
  }

  return state
}

// NOTES: This is the primary reducer demonstrating how RFR
// replaces the need for React Router's <Route /> component.
// Instead of a switch, we use a hash table for better performance.
const components = {
  OVERVIEW: 'Overview',
  INVEST: 'Invest',
  PORTFOLIO: 'Portfolio',
  [NOT_FOUND]: 'NotFound'
}

export const page = (state: string = 'OVERVIEW', action: any = {}) =>
  components[action.type] || state
