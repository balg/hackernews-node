const jwt = require('jsonwebtoken')
const APP_SECRET = 'GraphQL-is-aw3some'

const getUserId = context => {
  const authorization = context.request.get('Authorization')
  if (authorization) {
    const token = authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }
  throw new Error('Not authorized')
}

module.exports = {
  APP_SECRET,
  getUserId,
}