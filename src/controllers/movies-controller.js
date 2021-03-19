const boom = require('@hapi/boom')
const { Movies } = require('../models')
const { isValidObjectId } = require('mongoose')
const { MoviesRepository } = require('../repositories')
const { NotFound, UnprocessableEntity } = require('http-errors')

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

const view = async (request, reply) => {
  try {
    const { id } = request.params

    if (!isValidObjectId(id)) {
      throw UnprocessableEntity()
    }

    const repository = new MoviesRepository(Movies)
    const data = await repository.findById(id)

    if (!data) {
      throw NotFound()
    }

    reply.send(data)
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

const update = async (request, reply) => {
  try {
    const { id } = request.params

    if (!isValidObjectId(id)) {
      throw UnprocessableEntity()
    }

    const repository = new MoviesRepository(Movies)
    const data = await repository.findById(id)

    if (!data) {
      throw NotFound()
    }

    const res = await repository.findByIdAndUpdate(id, request.body, { new: true })

    reply.send(res)
  } catch (err) {
    throw boom.boomify(err)
  }
}

const exclude = async (request, reply) => {
  try {
    const { id } = request.params

    if (!isValidObjectId(id)) {
      throw UnprocessableEntity()
    }

    const repository = new MoviesRepository(Movies)
    const data = await repository.findById(id)

    if (!data) {
      throw NotFound()
    }

    await repository.deleteById(id)

    reply.code(204).send()
  } catch (err) {
    throw boom.boomify(err)
  }
}

module.exports = {
  list,
  view,
  create,
  update,
  exclude
}
