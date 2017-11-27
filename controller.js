'use strict'
const fs = require('fs')

function addMapping(router, mapping) {
  const { checkToken } = require('./auth')

  for (var url in mapping) {
    if (url.startsWith('GET ')) {
      var path = url.substring(4)
      router.get(path, mapping[url])
      console.log(`- register API: GET ${path}`)
    } else if (url.startsWith('AUTH GET ')) {
      var path = url.substring(9)
      router.get(path, checkToken, mapping[url])
      console.log(`- register API: AUTH GET ${path}`)
    } else if (url.startsWith('POST ')) {
      var path = url.substring(5)
      router.post(path, mapping[url])
      console.log(`- register API: POST ${path}`)
    } else if (url.startsWith('AUTH POST ')) {
      var path = url.substring(10)
      router.post(path, checkToken, mapping[url])
      console.log(`- register API: AUTH POST ${path}`)
    } else if (url.startsWith('OPTIONS ')) {
      var path = url.substring(8)
      router.options(path, mapping[url])
      console.log(`- register API: OPTIONS ${path}`)
    } else {
      console.log(`invalid URL: ${url}`)
    }
  }
}

function addControllers(router) {
  var files = fs.readdirSync(__dirname + '/controllers')
  var js_files = files.filter((f) => {
    return f.endsWith('.js')
  }, files)

  console.log('\n-------- loading controllers --------\n')

  for (var f of js_files) {
    console.log(`\nprocess controller: ${f} ...`)
    let mapping = require(__dirname + '/controllers/' + f)
    addMapping(router, mapping)
  }

  console.log('\n-------- controllers load complete --------\n')
}

module.exports = function(dir) {
  let
    controllers_dir = dir || 'controllers',
    router = require('koa-router')()
  addControllers(router, controllers_dir)
  return router.routes()
}
