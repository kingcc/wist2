'use strict';
var register = require('babel-cli/node_modules/babel-core/register');

register({
    presets: ['stage-3']
});

require('./app.js');