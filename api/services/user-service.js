const bcrypt = require('bcrypt')

// Helpers
const statusCode = require('../helpers/status-code')
const Response = require('../helpers/response')
const Token = require('../helpers/token')

// Models
const { User } = require('../database/models/index')

class UserService {
  static async signUp (res, data) {
    const user = await User.create(data)
    return Response.success(res, statusCode.CREATED, user, 'You have registered successfully')
  }

  static async signIn (res, data) {
    // Find user by email
    const user = await User.findOne({ where: { email: data?.email } })
    if (!user) {
      return Response.error(res, statusCode?.NOT_FOUND, 'Do not exist an user with this email')
    }

    // Validate password
    const isMatch = bcrypt.compareSync(data?.password, user?.password)
    if (!isMatch) {
      return Response.error(res, statusCode?.NOT_AUTHORIZED, 'Email and password do not match')
    }

    // Generate a token to the session
    const token = Token.generate(user?.id, 'user')
    return Response.success(res, statusCode?.OK, { user, token }, 'User successfully authenticated')
  }
}

module.exports = UserService