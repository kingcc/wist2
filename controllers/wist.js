'use strict';

var fn_wist = async(ctx, next) => {

  var string = ctx.params.wist;
  var google = require('wist/lib/google');
  var baidu = require('wist/lib/baidu');
  const Koa = require('koa');
  var app = new Koa();

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
  google.tld = 'fuckgfw.ggss.cf'


  const search = () => {
    return new Promise((resolve, reject) => {
      baidu(string, function(err, res) {
        if (err) console.error(err);

        for (var i = 0; i < res.links.length; ++i) {
          var link = res.links[i];
          baiduResults.push(link);
        }
        if (baiduCounter < pages) {
          baiduCounter += 1;
          if (res.next) res.next();
        } else {
          google(string, function(err, res) {
            if (err) console.error(err);

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
  ctx.response.body = await search();

};

module.exports = {
  'GET /wist/:wist': fn_wist
};
