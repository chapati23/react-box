module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      generators: true,
      experimentalObjectRestSpread: true
    },
    sourceType: 'module',
    allowImportExportEverywhere: false
  },
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:react/recommended',
    'plugin:flowtype/recommended',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  plugins: ['react', 'prettier', 'flowtype'],
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.json', '.css']
      }
    }
  },
  globals: {
    __DEV__: true,
    __dirname: true,
    artifacts: true,
    beforeEach: true,
    console: true,
    describe: true,
    xdescribe: true,
    document: true,
    expect: true,
    fetch: true,
    it: true,
    xit: true,
    jest: true,
    module: true,
    process: true,
    Promise: true,
    require: true,
    test: true,
    window: true
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true,
        trailingComma: 'none'
      }
    ],
    'no-console': 1 // should be just a warning otherwise webpack stops rendering pages at all
  }
}
