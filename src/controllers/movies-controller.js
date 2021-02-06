const boom = require('boom')
const { Movies } = require('../models')
const { MoviesRepository } = require('../repositories')

const create = async (request, reply) => {
  try {
    const movie = new MoviesRepository(Movies)
    const res = await movie.create(request.body)

    reply.send(res)
  } catch (err) {
    throw boom.boomify(err)
  }
}

module.exports = {
  create
}
