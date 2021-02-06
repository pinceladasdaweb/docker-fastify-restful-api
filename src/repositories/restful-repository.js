/**
*  Default RestfulRepository Interface
*/
class RestfulRepository {
  constructor (model) {
    this.model = model
  }

  /**
  * @param {Object} query
  */
  query (query = {}, options = {}) {
    const labels = {
      totalDocs: 'total',
      totalPages: 'pages'
    }

    return this.model.paginate(query, {
      ...options,
      ...(options?.page ? { page: options.page } : { page: 1 }),
      ...(options?.limit ? { limit: options.limit } : { limit: 100 }),
      ...(options?.sort ? { sort: options.sort } : { sort: { _id: 1 } }),
      customLabels: labels
    })
  }

  /**
  *
  * @param {Object} data
  */
  create (data) {
    return this.model.create(data)
  }

  /**
  * @param {String} prop
  * @param {String} value
  */
  findOneBy (prop, value) {
    if (!prop || !value) {
      throw new Error('Property and value must be specified.')
    }

    return this.model.findOne({ [prop]: value })
  }

  /**
  * @param {String} id
  */
  findById (id) {
    return this.findOneBy('_id', id)
  }

  /**
  *
  * @param {String} id
  */
  findByIdAndRemove (id, user) {
    return this.model.deleteById(id, user)
  }

  /**
  *
  * @param {String} id
  * @param {Object} data
  * @param {Object} options
  */
  async findByIdAndUpdate (id, data, options = {}) {
    const obj = await this.model.findOneAndUpdate({ _id: id }, data, options)

    return obj.save()
  }

  /**
  *
  * @param {String} id
  */
  deleteById (id) {
    return this.model.deleteById(id)
  }
}

module.exports = RestfulRepository
