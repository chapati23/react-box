import React from 'react'
import { NavLink } from 'redux-first-router-link'
import logo from './logo.svg'
import styles from './styles.css'

const Header = () =>
  <header className={styles.header}>
    <a className={styles.logo} href="/" title="platform.brickblock.io">
      <img src={logo} alt="Brickblock Logo" />
    </a>
    <nav className={styles.nav}>
      <NavLink
        exact
        to="/"
        className={styles.navLink}
        activeClassName={styles.current}
      >
        Overview
      </NavLink>

      <NavLink
        to="/invest"
        className={styles.navLink}
        activeClassName={styles.current}
      >
        Invest
      </NavLink>

      <NavLink
        to="/portfolio"
        className={styles.navLink}
        activeClassName={styles.current}
      >
        Portfolio
      </NavLink>
    </nav>
  </header>

export default Header
