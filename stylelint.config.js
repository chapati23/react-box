module.exports = {
  extends: 'stylelint-config-standard',
  plugins: ['stylelint-order', 'stylelint-declaration-use-variable'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['include', 'mixin']
      }
    ],
    'at-rule-no-vendor-prefix': true,
    'declaration-colon-newline-after': null,
    'declaration-no-important': true,
    'font-family-name-quotes': 'always-unless-keyword',
    'font-weight-notation': 'numeric',
    'function-url-quotes': 'always',
    indentation: null,
    'max-nesting-depth': 10,
    'media-feature-name-no-vendor-prefix': true,
    'order/properties-alphabetical-order': true,
    'property-no-vendor-prefix': true,
    'property-blacklist': [
      'thin',
      'medium',
      'thick',
      'lighter',
      'normal',
      'bold',
      'bolder'
    ],
    // 'composes' is needed for CSS Modules composition
    'property-no-unknown': [true, { ignoreProperties: ['composes'] }],
    'selector-attribute-quotes': 'always',
    'selector-max-compound-selectors': 4,
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global'] }
    ],
    'selector-no-vendor-prefix': true,
    'string-quotes': 'single',
    'unit-whitelist': ['px', '%', 'deg', 'ms', 's', 'em', 'vh', 'vw'],
    'value-no-vendor-prefix': true,
    'value-list-comma-newline-after': null
  }
}
