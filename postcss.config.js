const colors = {
  black: '#141a2f',
  cta: '#e3d841',
  'dark-blue': '#172c81',
  'light-blue': '#4884c2',
  highlight: '#6bc3ff',
  light: '#e8ecff',
  'text-inactive': 'rgba(255, 255, 255, 0.4)',
  white: '#fff'
}

const cssVariables = Object.assign({}, colors, {
  'content-top-offset-desktop': '100px',
  'content-top-offset-mobile': '50px',
  'footer-height-mobile': '130px',
  'footer-height-desktop': '75px',
  'header-height-desktop': '170px',
  'header-height-mobile': '120px',
  'page-offset': '25px'
})

// Why em instead of px? Glad you asked: https://cloudfour.com/thinks/the-ems-have-it-proportional-media-queries-ftw/
const mediaQueries = {
  '--phone': '(min-width: 20em)', // 320px
  '--tablet': '(min-width: 48em)', // 768px
  '--desktop': '(min-width: 62em)', // 992px
  '--large-desktop': '(min-width: 75em)' // 1200px
}

module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-custom-properties': { variables: cssVariables },
    'postcss-custom-media': { extensions: mediaQueries },
    'postcss-calc': {},
    'postcss-color-function': {},
    'postcss-cssnext': {
      browsers: ['last 2 versions', '> 5%'],
      warnForDuplicates: false
    },
    cssnano: {}
  }
}
