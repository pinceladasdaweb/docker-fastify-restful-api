const boom = require('boom')
const { Users } = require('../models')
const { UsersRepository } = require('../repositories')

const register = async (request, reply) => {
  try {
    const { name, email, password } = request.body

    const user = new UsersRepository(Users)
    const res = await user.create({ name, email, password })

    reply.code(201).send(res)
  } catch (err) {
    throw boom.boomify(err)
  }
}

module.exports = {
  register
}
