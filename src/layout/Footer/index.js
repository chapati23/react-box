import React from 'react'
import styles from './styles.css'

const footerItems = [
  {
    link: 'https://t.me/joinchat/AAAAAERj-_1p8AktrkESlQ',
    title: 'Telegram'
  },
  {
    link: 'https://slack.brickblock.io/',
    title: 'Slack'
  },
  {
    link: 'https://www.facebook.com/brickblock.io/',
    title: 'Facebook'
  },
  {
    link: 'https://www.linkedin.com/company/18035479',
    title: 'LinkedIn'
  },
  {
    link: 'https://www.youtube.com/channel/UC7etm1NmMFIlg2KJ6VXNNrA/videos',
    title: 'YouTube'
  },
  {
    link: 'https://twitter.com/brickblock_io',
    title: 'Twitter'
  },
  {
    link: 'https://www.brickblock.io/img/brickblock-wechat.jpg',
    title: 'WeChat'
  },
  {
    link: 'https://github.com/brickblock-io',
    title: 'Github'
  },
  {
    link: 'https://medium.com/@Brickblock',
    title: 'Medium'
  }
]

const Footer = () =>
  <footer className={styles.footer}>
    <nav className={styles.nav}>
      {footerItems.map(item =>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          key={item.link}
        >
          {item.title}
        </a>
      )}
    </nav>
  </footer>

export default Footer
