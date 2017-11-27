const jwt = require('jsonwebtoken')

async function checkToken(ctx, next) {
  // Add your own token-check function
}

async function createToken(id, exp = 10 * 24 * 60 * 60) {
  // Add your own token-create function
}

module.exports = { checkToken, createToken }
