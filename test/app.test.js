const assert = require('node:assert')
const { test, before, after } = require('node:test')
const setupTestApp = require('./helpers/setup')

let ctx

before(async () => {
  ctx = await setupTestApp()
})

after(async () => {
  await ctx.stop()
})

test('GET /api/v1/ responds with the API welcome message', async () => {
  const res = await ctx.app.inject({ method: 'GET', url: '/api/v1/' })

  assert.strictEqual(res.statusCode, 200)
  assert.strictEqual(res.json().message, 'Fastify API is on fire')
})

test('GET /health reports the database as connected', async () => {
  const res = await ctx.app.inject({ method: 'GET', url: '/health' })

  assert.strictEqual(res.statusCode, 200)
  assert.deepStrictEqual(res.json(), { status: 'ok', database: 'up' })
})

test('GET /docs/json exposes the OpenAPI document', async () => {
  const res = await ctx.app.inject({ method: 'GET', url: '/docs/json' })

  assert.strictEqual(res.statusCode, 200)
  assert.ok(res.json().openapi, 'document must declare an openapi version')
})

test('unknown route falls through to the not found handler', async () => {
  const res = await ctx.app.inject({ method: 'GET', url: '/nope' })

  assert.strictEqual(res.statusCode, 404)
  assert.strictEqual(res.json().error, 'Not found')
})
