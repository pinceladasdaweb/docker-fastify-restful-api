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

test('GET /api/v1/ responde com a mensagem da API', async () => {
  const res = await ctx.app.inject({ method: 'GET', url: '/api/v1/' })

  assert.strictEqual(res.statusCode, 200)
  assert.strictEqual(res.json().message, 'Fastify API is on fire')
})

test('GET /health reporta banco conectado', async () => {
  const res = await ctx.app.inject({ method: 'GET', url: '/health' })

  assert.strictEqual(res.statusCode, 200)
  assert.deepStrictEqual(res.json(), { status: 'ok', database: 'up' })
})

test('GET /docs/json expõe o documento OpenAPI', async () => {
  const res = await ctx.app.inject({ method: 'GET', url: '/docs/json' })

  assert.strictEqual(res.statusCode, 200)
  assert.ok(res.json().openapi, 'documento deve ter a versão do openapi')
})

test('rota inexistente cai no not found handler', async () => {
  const res = await ctx.app.inject({ method: 'GET', url: '/nope' })

  assert.strictEqual(res.statusCode, 404)
  assert.strictEqual(res.json().error, 'Not found')
})
