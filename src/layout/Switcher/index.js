// @flow
import React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { TransitionGroup, Transition } from 'transition-group'
import UniversalComponent from '../UniversalComponent'

import styles from './styles.css'

const isLoading = createSelector(
  [state => state.location.type, state => state.location.payload],
  (type, { slug, category }) => false // eslint-disable-line no-unused-vars
)

type Props = {
  page: string,
  direction: string,
  isLoading: boolean
}
const Switcher = ({ page, direction, isLoading }: Props) =>
  <TransitionGroup
    className={`${styles.switcher} ${direction}`}
    duration={500}
    prefix="fade"
  >
    <Transition key={page}>
      <UniversalComponent page={page} isLoading={isLoading} />
    </Transition>
  </TransitionGroup>

const mapState = ({ page, direction, ...state }) => ({
  page,
  direction,
  isLoading: isLoading(state)
})

export default connect(mapState)(Switcher)
