const boom = require('boom')
const { Movies } = require('../models')
const { MoviesRepository } = require('../repositories')

const list = async (request, reply) => {
  try {
    const { limit, page, sort } = request.query
    const repository = new MoviesRepository(Movies)
    const docs = await repository.query({}, { limit, page, sort })

    reply.send(docs)
  } catch (err) {
    throw boom.boomify(err)
  }
}

const create = async (request, reply) => {
  try {
    const repository = new MoviesRepository(Movies)
    const res = await repository.create(request.body)

    reply.code(201).send(res)
  } catch (err) {
    throw boom.boomify(err)
  }
}

module.exports = {
  list,
  create
}
