const boom = require('@hapi/boom')
const bcrypt = require('bcryptjs')
const { Users } = require('../models')
const { Unauthorized } = require('http-errors')
const { UsersRepository } = require('../repositories')

const auth = async (request, reply) => {
  try {
    const { email, password } = request.body

    const repository = new UsersRepository(Users)
    const user = await repository.findOneBy('email', email)

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = await reply.jwtSign({ id: user._id, name: user.name }, {
        expiresIn: '7d'
      })

      reply.send({ token })
    } else {
      throw Unauthorized('Invalid email or password.')
    }
  } catch (err) {
    throw boom.boomify(err)
  }
}

const register = async (request, reply) => {
  try {
    const { name, email, password } = request.body

    const repository = new UsersRepository(Users)
    const res = await repository.create({ name, email, password })

    reply.code(201).send(res)
  } catch (err) {
    throw boom.boomify(err)
  }
}

module.exports = {
  auth,
  register
}
