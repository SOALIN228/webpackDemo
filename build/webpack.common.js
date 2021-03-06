const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const makePlugins = () => {
  const plugins = [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*']
      }
    ]),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]

  const files = fs.readdirSync(path.resolve(__dirname, '../dll'))
  files.forEach(file => {
    if (/.*\.dll\.js/.test(file)) {
      // 向html模板文件中添加打包后第三方库代码包
      plugins.push(new AddAssetHtmlPlugin({
        filepath: path.resolve(__dirname, '../dll', file)
      }))
    }
    if (/.*\.manifest\.json/.test(file)) {
      // 如果第三方库代码包中包含该库，则使用代码包中代码，提升打包速度
      plugins.push(new webpack.DllReferencePlugin({
        manifest: path.resolve(__dirname, '../dll', file)
      }))
    }
  })
  return plugins
}

const configs = {
  entry: {
    main: './src/index.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, "../src"),
          path.resolve(__dirname, "../test")
        ],
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'img/',
            limit: 10000
          }
        }]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'media/',
            limit: 10000
          }
        }]
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'fonts/',
            limit: 10000
          }
        }]
      }
    ]
  },
  optimization: {
    usedExports: true, // 开启tree shaking
    splitChunks: {
      chunks: 'all', // 默认为 async
      cacheGroups: {
        vendors: {
          name: 'vendors', // 将所有符合要求的文件打包成一个vendors文件
          test: /[\\/]node_modules[\\/]/, // 优先对node_modules中的文件进行打包
          priority: -10 // 优先级
        },
        default: { // 对不在node_modules中的文件进行打包
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true // 忽略已经打包过的共用代码
        }
      }
    }
  }
}

configs.plugins = makePlugins()

module.exports = configs
