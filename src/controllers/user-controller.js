const boom = require('boom')
const bcrypt = require('bcryptjs')
const { Users } = require('../models')
const { UsersRepository } = require('../repositories')

const auth = async (request, reply) => {
  try {
    const { email, password } = request.body

    const user = new UsersRepository(Users)
    const userInfo = await user.findOneBy('email', email)

    if (userInfo && bcrypt.compareSync(password, userInfo.password)) {
      const token = await reply.jwtSign({ id: userInfo._id, name: userInfo.name }, {
        expiresIn: '7d'
      })

      reply.send({ token })
    }
  } catch (err) {
    throw boom.boomify(err)
  }
}

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
  auth,
  register
}
