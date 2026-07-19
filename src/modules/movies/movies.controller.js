const Movies = require('./movies.model')
const { NotFound } = require('http-errors')
const RestfulRepository = require('../../shared/repositories/restful-repository')

const repository = new RestfulRepository(Movies)

const list = async (request, reply) => {
  const { limit, page, sort } = request.query
  const docs = await repository.query({}, { limit, page, sort })

  return Array.isArray(docs.docs) && docs.docs.length > 0 ? reply.send(docs) : reply.code(204).send()
}

const view = async (request, reply) => {
  const { id } = request.params
  const data = await repository.findById(id)

  if (!data) {
    throw new NotFound()
  }

  reply.send(data)
}

const create = async (request, reply) => {
  const res = await repository.create(request.body)

  reply.code(201).send(res)
}

const update = async (request, reply) => {
  const { id } = request.params
  const res = await repository.findByIdAndUpdate(id, request.body)

  if (!res) {
    throw new NotFound()
  }

  reply.send(res)
}

const exclude = async (request, reply) => {
  const { id } = request.params
  const data = await repository.findById(id)

  if (!data) {
    throw new NotFound()
  }

  await repository.deleteById(id)

  reply.code(204).send()
}

module.exports = {
  list,
  view,
  create,
  update,
  exclude
}
