const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractPlugin = require('extract-text-webpack-plugin')
const baseConfig = require('./webpack.config.base')
const VueClientPlugin = require('vue-server-renderer/client-plugin')
// const cdnConfig = require('../app.config').cdn

const isDev = process.env.NODE_ENV === 'development'

const defaultPluins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  new HTMLPlugin(),
  // new HTMLPlugin({
  //   template: path.join(__dirname, 'template.html')
  // }),
  new VueClientPlugin()
]

const devServer = {
  port: 8000,
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

let config

if (isDev) {
  config = merge(baseConfig, {
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
} else {
  config = merge(baseConfig, {
    entry:path.join(__dirname,'../client/index.js'),
  output:{
    filename:'bundle.[hash:8].js',
    path:path.join(__dirname,'../dist')
  },
    module: {
      rules: [
        {
          test: /\.styl/,
          use: ExtractPlugin.extract({
            fallback: 'vue-style-loader',
            use: [
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true
                }
              },
              'stylus-loader'
            ]
          })
        }
      ]
    },
    plugins: defaultPluins.concat([
      new ExtractPlugin('styles.[hash:8].css'),
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'vendor'
      // }),
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'runtime'
      // }),
      // new webpack.NamedChunksPlugin()
    ])
  })
}

config.optimization = {
  splitChunks: {
      cacheGroups: {                  // 这里开始设置缓存的 chunks
          commons: {
              chunks: 'initial',      // 必须三选一： "initial" | "all" | "async"(默认就是异步)
              minSize: 0,             // 最小尺寸，默认0,
              minChunks: 2,           // 最小 chunk ，默认1
              maxInitialRequests: 5   // 最大初始化请求书，默认1
          },
          vendor: {
              test: /node_modules/,   // 正则规则验证，如果符合就提取 chunk
              chunks: 'initial',      // 必须三选一： "initial" | "all" | "async"(默认就是异步)
              name: 'vendor',         // 要缓存的 分隔出来的 chunk 名称
              priority: 10,           // 缓存组优先级
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
