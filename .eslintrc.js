module.exports = {
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-strongly-recommended'
  ],
  rules: {
    'vue/no-v-html': 0,
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 1
        },
        multiline: {
          max: 1
        }
      }
    ],
    quotes: [2, 'single', { avoidEscape: true }],
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-console': 1,
    'no-debugger': 1,
    'no-restricted-imports': [2, { paths: ['lodash-es'] }],
    'prefer-arrow-callback': 1,
    'dot-notation': [
      'error',
      { allowPattern: '^[a-z]+(_[a-z]+)+$' }
    ],
    semi: ['error', 'never'],
    'vue/attributes-order': 1,
    'vue/order-in-components': ['error', {
      order: [
        'el',
        'name',
        'parent',
        'functional',
        'middleware',
        ['delimiters', 'comments'],
        ['components', 'directives', 'filters'],
        'extends',
        'mixins',
        'inheritAttrs',
        'model',
        ['props', 'propsData'],
        'fetch',
        'asyncData',
        'data',
        'computed',
        'watch',
        'LIFECYCLE_HOOKS',
        'methods',
        'head',
        ['template', 'render'],
        'renderError'
      ]
    }],
    'vue/no-confusing-v-for-v-if': 1,
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'always'
    }],
    'comma-dangle': 2,
    'vue/singleline-html-element-content-newline': ['error', {
      ignoreWhenNoAttributes: true,
      ignores: ['pre', 'textarea']
    }]
  }
}
