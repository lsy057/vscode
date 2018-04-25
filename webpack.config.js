const path=require('path')
const HTMLPLUGIN=require('html-webpack-plugin')
const isdev= process.env.NODE_ENV==='development'
const webpack=require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config={
  target:"web",
  entry:path.join(__dirname,'src/index.js'),
  output:{
    filename:'bundle.[hash:8].js',
    path:path.join(__dirname,'dist')
  },
  module:{
    rules:[
        {
            test:/.vue$/,
            loader:'vue-loader'

        },
        {
          test:/.jsx$/,
          loader:'babel-loader'

      },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader:"url-loader",
              options:{ 
                limit:1000, 
                name:"[name]-aaaa.[ext]" 
              } 
            }
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
           'file-loader'
          ]
        }
      ]
  },
  plugins:[
    new webpack.DefinePlugin({
      'process.env':{
        NODE_ENV:isdev ? '"development"': '"production"'
      }
    }),
    new HTMLPLUGIN()
  ]
}
if(isdev){
  config.module.rules.push(
    {
      test: /\.styl$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader:"postcss-loader",
          options:{
            sourceMap:true
          }
        },
        'stylus-loader'
      ]
    }
  )
  config.devtool='#cheap-module-eval-source-map'
  config.devServer={
    port:8000,
    host:'0.0.0.0',
    overlay:{
      errors:true,
    },
    hot: true
  }
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
}else{
  config.output.filename = '[name].[chunkhash:8].js';
  config.module.rules.push({
    test: /\.styl/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
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
});
config.plugins.push(
  new ExtractTextPlugin('styles.[hash:8].css'),

  // // 将类库文件单独打包出来
  // new webpack.optimize.CommonsChunkPlugin({
  //     name: 'vendor'
  // })

  // webpack相关的代码单独打包
  // new webpack.optimize.CommonsChunkPlugin({
  //     name: 'runtime'
  // })
);
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

}

module.exports=config