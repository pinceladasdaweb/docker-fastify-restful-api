const assert = require('node:assert')
const { test, before, after } = require('node:test')
const setupTestApp = require('./helpers/setup')

let ctx
let headers

before(async () => {
  ctx = await setupTestApp()

  const token = ctx.app.jwt.sign({ id: 'test-user', name: 'Test User' })
  headers = { authorization: `Bearer ${token}` }
})

after(async () => {
  await ctx.stop()
})

const inject = (method, url, payload) => ctx.app.inject({ method, url, payload, headers })

const movie = {
  title: 'Cidade de Deus',
  year: 2002,
  releasedAt: '2002-08-30T00:00:00.000Z',
  genres: ['Crime', 'Drama'],
  director: 'Fernando Meirelles',
  writers: 'Bráulio Mantovani',
  actors: 'Alexandre Rodrigues, Leandro Firmino',
  description: 'A luta de Buscapé para se tornar fotógrafo.',
  languages: ['Portuguese'],
  country: 'BRA',
  imdbID: 'tt0317248'
}

test('without a token, every movies route responds 401', async () => {
  const res = await ctx.app.inject({ method: 'GET', url: '/api/v1/movies' })

  assert.strictEqual(res.statusCode, 401)
})

test('empty list responds 200 with docs: []', async () => {
  const res = await inject('GET', '/api/v1/movies')

  assert.strictEqual(res.statusCode, 200)
  assert.deepStrictEqual(res.json().docs, [])
})

test('payload missing required fields responds 400', async () => {
  const res = await inject('POST', '/api/v1/movies', { title: 'Incompleto' })

  assert.strictEqual(res.statusCode, 400)
})

test('creates a movie and generates the slug from title and year', async () => {
  const res = await inject('POST', '/api/v1/movies', movie)

  assert.strictEqual(res.statusCode, 201)

  const body = res.json()
  assert.strictEqual(body.slug, 'cidade-de-deus-2002', 'slug must normalize accented characters')
  assert.strictEqual(body.__v, undefined, 'mongoose internals must not leak')
})

test('listing returns the created movie with pagination', async () => {
  const res = await inject('GET', '/api/v1/movies')

  assert.strictEqual(res.statusCode, 200)

  const body = res.json()
  assert.strictEqual(body.docs.length, 1)
  assert.strictEqual(body.total, 1)
  assert.strictEqual(body.page, 1)
})

test('limit above 100 responds 400', async () => {
  const res = await inject('GET', '/api/v1/movies?limit=200')

  assert.strictEqual(res.statusCode, 400)
})

test('find by id works and an unknown id responds 404', async () => {
  const created = (await inject('POST', '/api/v1/movies', { ...movie, title: 'O Auto da Compadecida', year: 2000 })).json()

  const found = await inject('GET', `/api/v1/movies/${created._id}`)
  assert.strictEqual(found.statusCode, 200)
  assert.strictEqual(found.json().title, 'O Auto da Compadecida')

  const missing = await inject('GET', '/api/v1/movies/ffffffffffffffffffffffff')
  assert.strictEqual(missing.statusCode, 404)
})

test('id outside the ObjectId format is rejected by the schema with 400', async () => {
  const res = await inject('GET', '/api/v1/movies/not-an-id')

  assert.strictEqual(res.statusCode, 400)
  assert.match(res.json().message, /ObjectId/)
})

test('PATCH updates the movie in a single write', async () => {
  const created = (await inject('POST', '/api/v1/movies', { ...movie, title: 'Tropa de Elite', year: 2007 })).json()

  const res = await inject('PATCH', `/api/v1/movies/${created._id}`, { year: 2008 })

  assert.strictEqual(res.statusCode, 200)
  assert.strictEqual(res.json().year, 2008)
})

test('DELETE responds 204 and the movie disappears from queries (soft delete)', async () => {
  const created = (await inject('POST', '/api/v1/movies', { ...movie, title: 'Central do Brasil', year: 1998 })).json()

  const del = await inject('DELETE', `/api/v1/movies/${created._id}`)
  assert.strictEqual(del.statusCode, 204)

  const after = await inject('GET', `/api/v1/movies/${created._id}`)
  assert.strictEqual(after.statusCode, 404)
})
