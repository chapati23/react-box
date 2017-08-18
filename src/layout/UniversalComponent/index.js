// @flow
import React from 'react'
import universal from 'react-universal-component'
import NotFound from '../../pages/NotFound'
import PageSpinner from '../../ui-kit/PageSpinner'

// const UniversalComponent = universal(
//   ({ page }) => import(`../../pages/${page}`),
//   {
//     minDelay: 500,
//     loading: PageSpinner,
//     error: NotFound
//   }
// )

type Props = {
  page: string,
  isLoading: boolean
}
const UniversalComponent = ({ page, isLoading }: Props) => {
  const Component = components[page] || NotFound
  return <Component isLoading={isLoading} />
}

const components = {
  Overview: universal(() => import('../../pages/Overview'), {
    minDelay: 500,
    loading: PageSpinner
  }),
  Invest: universal(() => import('../../pages/Invest'), {
    minDelay: 500,
    loading: PageSpinner
  }),
  Portfolio: universal(() => import('../../pages/Portfolio'), {
    minDelay: 500,
    loading: PageSpinner
  }),
  NotFound
}

export default UniversalComponent
