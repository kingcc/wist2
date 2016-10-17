'use strict';

var fn_wist = async(ctx, next) => {

  var string = ctx.params.wist;
  var req = ctx.request;

  var google = require('wist/lib/google');
  var baidu = require('wist/lib/baidu');

  var
    googleCounter = 0,
    baiduCounter = 0,
    pages = 2;

  var
    googleResults = [],
    baiduResults = [];

  baidu.resultsPerPage = 10;
  baidu.lang = 'cn';
  baidu.sensitive = [];

  google.lang = 'cn';
  google.protocol = 'https'
  google.tld = 'www.google.com'

  const search = () => {
    return new Promise((resolve, reject) => {
      googleCounter = 0;
      baiduCounter = 0;
      googleResults = [];
      baiduResults = [];
      baidu(string, function(err, res) {
        if (err) throw err;

        for (var i = 0; i < res.links.length; ++i) {
          var link = res.links[i];
          baiduResults.push(link);
        }
        if (baiduCounter < pages) {
          baiduCounter += 1;
          if (res.next) res.next();
        } else {
          google(string, function(err, res) {           
            if (err) throw err;

            for (var i = 0; i < res.links.length; ++i) {
              var link = res.links[i];
              googleResults.push(link);
            }
            if (googleCounter < pages) {
              googleCounter += 1;
              if (res.next) res.next();
            } else {
              resolve({ baidu: baiduResults, google: googleResults });
            }
          });
        }
      });
    });
  };
  

  try {
    console.log(` recive request: ${req.ip} -> ${req.method} ${req.protocol}:/\/${req.hostname}${req.path}`);
    ctx.response.type = 'application/json';
    ctx.response.set("Access-Control-Allow-Origin", "*");
    ctx.response.body = await search();
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = {
      code: e.code || 'internal:unknown_error',
      message: e.message || ''
    };
  }

};

module.exports = {
  'GET /api/wist/:wist': fn_wist
};
