const webpack = require('webpack')
const merge = require('webpack-merge') // 用于通用配置
const commonConfig = require('./webpack.common') // 引入通用文件

const devConfig = {
  mode: 'development', // 开发环境
  devtool: 'cheap-module-eval-source-map', // 开发环境配置 development
  devServer: {
    contentBase: './dist', // 打开文件路径
    open: true, // 自动打开页面
    port: 8080, // 指定端口号
    // proxy: { // 跨域代理
    //   '/api': 'http://localhost:3000'
    // }
    hot: true,
    // hotOnly: true
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader', // 打包css
            options: {
              importLoaders: 2, // 在调用当前loader(CSS)之前，要调用两个loader(postcss 和 sass)
              // modules: true // 模块化打包css
            }
          },
          'postcss-loader', // 支持插件
          'sass-loader', // 打包sass
        ]
      }, {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // HMR
  ]
}

module.exports = merge(commonConfig, devConfig) // 导出配置文件