'use strict'

const Koa = require('koa')
const bodyParser = require('koa-body')
const https = require('https')
const fs = require('fs')

const rest = require('./rest')
const controller = require('./controller')

const app = new Koa()
const isProduction = process.env.NODE_ENV === 'production'

app.use(bodyParser({ multipart: true }))
app.use(rest.restify())
app.use(controller())

const options = {
  key: fs.readFileSync('ssl/private.key'),
  cert: fs.readFileSync('ssl/certificate.crt')
}

https.createServer(options, app.callback()).listen(3000)
console.log('wist-api started at port 3000...')
