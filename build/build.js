'use strict'
require('./check-versions')()


const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
var webpackConfig = process.env.NODE_ENV === 'testing'
? require('./webpack.btest.conf')
: process.env.NODE_ENV === 'production'
? require('./webpack.prod.conf')
: process.env.NODE_ENV === 'devlop'
? require('./webpack.devlop.conf')
: require('./webpack.dev.conf')

var config = process.env.NODE_ENV === 'testing'
? require('../config').test
: process.env.NODE_ENV === 'production'
? require('../config').build
: process.env.NODE_ENV === 'devlop'
? require('../config').devlop
: require('../config').dev

var spinner = ora(`building for ${ process.env.NODE_ENV  }...`)
spinner.start()
rm(path.join(config.assetsRoot, config.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
