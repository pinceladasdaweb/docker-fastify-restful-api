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

const register = payload => ctx.app.inject({ method: 'POST', url: '/api/v1/users/register', payload })
const auth = payload => ctx.app.inject({ method: 'POST', url: '/api/v1/users/auth', payload })

const user = {
  name: 'Ada Lovelace',
  email: 'Ada@Example.com',
  password: 'correct-horse'
}

test('registers a user without exposing the password in the response', async () => {
  const res = await register(user)

  assert.strictEqual(res.statusCode, 201)

  const body = res.json()
  assert.strictEqual(body.email, 'ada@example.com', 'email must be normalized to lowercase')
  assert.strictEqual(body.password, undefined, 'password must not leak in the response')
  assert.strictEqual(body.__v, undefined, 'mongoose internals must not leak')
})

test('duplicated email responds 409, even with different casing', async () => {
  const res = await register({ ...user, email: 'ADA@example.com' })

  assert.strictEqual(res.statusCode, 409)
})

test('invalid email responds 400 with the custom message', async () => {
  const res = await register({ ...user, email: 'not-an-email' })

  assert.strictEqual(res.statusCode, 400)
  assert.match(res.json().message, /email/)
})

test('short password responds 400', async () => {
  const res = await register({ name: 'x', email: 'short@example.com', password: '123' })

  assert.strictEqual(res.statusCode, 400)
  assert.match(res.json().message, /8 characters/)
})

test('login with valid credentials returns a JWT token', async () => {
  const res = await auth({ email: 'ada@example.com', password: user.password })

  assert.strictEqual(res.statusCode, 200)

  const { token } = res.json()
  const decoded = ctx.app.jwt.verify(token)
  assert.strictEqual(decoded.name, user.name)
})

test('wrong password responds 401', async () => {
  const res = await auth({ email: 'ada@example.com', password: 'wrong-password' })

  assert.strictEqual(res.statusCode, 401)
})

test('unknown email responds 401 with the same message', async () => {
  const res = await auth({ email: 'ghost@example.com', password: 'whatever-here' })

  assert.strictEqual(res.statusCode, 401)
  assert.match(res.json().message, /Invalid email or password/)
})

test('login rate limit responds 429 after 5 attempts within a minute', async () => {
  // the 3 calls above plus these 2 exhaust the limit of 5
  await auth({ email: 'ada@example.com', password: 'wrong-password' })
  await auth({ email: 'ada@example.com', password: 'wrong-password' })

  const res = await auth({ email: 'ada@example.com', password: user.password })

  assert.strictEqual(res.statusCode, 429)
})
