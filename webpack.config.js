const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development', // 打包环境，开发还是生产(development or production)
  devtool: 'cheap-module-eval-source-map', // 开发环境配置 development
  // devtool: 'cheap-module-source-map', // 生产环境配置 production
  entry: { // 入口文件
    main: './src/index.js', // 生成文件为main.js
    // bundle: './src/bundle.js' // 可以生成多个js文件，名字为键名
  },
  output: { // 出口文件
    // publicPath: 'http://cdn.com.cn', // 如果静态文件使用CDN，添加指定CDN路径
    filename: '[name].js', // 输出文件名
    path: path.resolve(__dirname, 'dist') // 输出文件路径 __dirname为webpack.config当前文件
  },
  devServer: {
    contentBase: './dist', // 打开文件路径
    open: true, // 自动打开页面
    port: 8080, // 指定端口号
    // proxy: { // 跨域代理
    //   '/api': 'http://localhost:3000'
    // }
    hot: true,
    hotOnly: true
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/, // 对node_modules中的JS进行忽略
      loader: 'babel-loader'
    }, {
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
    }, {
      test: /\.(png|svg|jpg|gif)$/, // 图片格式
      use: [{
        loader: 'url-loader', // 使用url-loader打包图片
        options: {
          name: '[name]_[hash].[ext]', // 配置打包后的名字 ext为文件扩展名
          outputPath: 'images/', // 输出路径
          limit: 20480 // 图片大于2kb使用base64进行打包，减少http请求
        }
      }]
    }, {
      test: /\.(woff|woff2|eot|ttf|otf)$/, // 字体格式
      use: [{
        loader: 'file-loader'
      }]
    }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // HMR
    new CleanWebpackPlugin(), // 自动清空输出文件,
    new HtmlWebpackPlugin({ template: 'src/index.html' }) // 指定html模板文件
  ]
}
