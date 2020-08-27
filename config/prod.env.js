'use strict'
const merge = require('webpack-merge')
const devlopEnv = require('./devlop.env') 

module.exports = merge(devlopEnv, {
  NODE_ENV: '"production"'
})
