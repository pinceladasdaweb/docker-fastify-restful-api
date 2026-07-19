const bcrypt = require('bcryptjs')
const Users = require('./users.model')
const { Conflict, Unauthorized } = require('http-errors')
const RestfulRepository = require('../../shared/repositories/restful-repository')

const repository = new RestfulRepository(Users)

const auth = async (request, reply) => {
  const { email, password } = request.body

  const user = await repository.findOneBy('email', email.toLowerCase())

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Unauthorized('Invalid email or password.')
  }

  const token = await reply.jwtSign({ id: user._id, name: user.name }, {
    expiresIn: '7d'
  })

  reply.send({ token })
}

const register = async (request, reply) => {
  const { name, email, password } = request.body

  const exists = await repository.findOneBy('email', email.toLowerCase())

  if (exists) {
    throw new Conflict('Email already registered.')
  }

  const res = await repository.create({ name, email, password })

  reply.code(201).send(res)
}

module.exports = {
  auth,
  register
}
