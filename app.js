'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');

const app = new Koa();
const isProduction = process.env.NODE_ENV === 'production';

app.use(bodyParser());
app.use(controller());

app.listen(3000);
console.log('node started at port 3000...');