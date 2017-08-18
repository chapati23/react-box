const jsLoader = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: 'babel-loader'
}

const cssLoader = {
  test: /\.css$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'css-loader/locals',
      options: {
        camelCase: true,
        importLoaders: 1,
        modules: true,
        localIdentName: '[name]__[local]--[hash:base64:5]'
      }
    },
    'resolve-url-loader',
    'postcss-loader?sourceMap'
  ]
}
const urlLoader = {
  test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 10000
      }
    }
  ]
}

const fileLoader = {
  test: /\.(pdf)$/,
  use: [
    {
      loader: 'file-loader'
    }
  ]
}

module.exports = [jsLoader, cssLoader, urlLoader, fileLoader]
