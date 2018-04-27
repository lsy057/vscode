const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.config.base')
const VueClientPlugin = require('vue-server-renderer/client-plugin')
// const cdnConfig = require('../app.config').cdn

const defaultPluins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"development"'
    }
  }),
  // new HTMLPlugin(),
  new HTMLPlugin({
    template: path.join(__dirname, 'template.html')
  }),
  new VueClientPlugin()
]

const devServer = {
  port: 8010,
  host: '0.0.0.0',
  overlay: {
    errors: true
  },
  // headers: { 'Access-Control-Allow-Origin': '*' },
  // historyApiFallback: {
  //   index: '/public/index.html'
  // },
  // proxy: {
  //   '/api': 'http://127.0.0.1:3333',
  //   '/user': 'http://127.0.0.1:3333'
  // },
  hot: true
}

let config = merge(baseConfig, {
  devtool: '#cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.styl/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          'stylus-loader'
        ]
      }
    ]
  },
  devServer,
  plugins: defaultPluins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ])
})

config.optimization = {
  splitChunks: {
    cacheGroups: { // 这里开始设置缓存的 chunks
      commons: {
        chunks: 'initial', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
        minSize: 0, // 最小尺寸，默认0,
        minChunks: 2, // 最小 chunk ，默认1
        maxInitialRequests: 5 // 最大初始化请求书，默认1
      },
      vendor: {
        test: /node_modules/, // 正则规则验证，如果符合就提取 chunk
        chunks: 'initial', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
        name: 'vendor', // 要缓存的 分隔出来的 chunk 名称
        priority: 10, // 缓存组优先级
        enforce: true
      }
    }
  },
  runtimeChunk: true
}
config.resolve = {
  alias: {
    'model': path.join(__dirname, '../client/model/client-model.js')
  }
}

module.exports = config
