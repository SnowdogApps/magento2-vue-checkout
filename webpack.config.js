const path = require('path');

module.exports = {
  entry: './view/frontend/web/js/script.js',
  output: {
    path: path.resolve(__dirname, './view/frontend/web/js/dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  }
}
