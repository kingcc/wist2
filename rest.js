module.exports = {
  APIError: function(code = 'internal:unknown_error', message = '') {
    this.code = code
    this.message = message
  },
  restify: (pathPrefix = '/api/') => {
    return async(ctx, next) => {
      if (ctx.request.path.startsWith(pathPrefix)) {
        console.log(`Recive request '${ctx.request.method} ${ctx.request.url}' from '${ctx.request.ip}'`)
        ctx.rest = (data) => {
          ctx.response.type = 'application/json'
          ctx.response.body = data
        }
        try {
          if (ctx.request.header.origin && /^http[s]?:\/\/[A-Za-z0-9]*\.name\.com[:]?[0-9]{0,4}.*$/.test(ctx.request.header.origin)) {
            ctx.response.set('Access-Control-Allow-Origin', ctx.request.header.origin)
          }
          await next()
        } catch (e) {
          console.log('Process API error...')
          ctx.response.status = 400
          ctx.response.type = 'application/json'
          ctx.response.body = {
            code: e.code || 'internal:unknown_error',
            message: e.message || ''
          }
        }
      } else {
        await next()
      }
    }
  }
}
