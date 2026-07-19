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

test('registra um usuário e não expõe a senha na resposta', async () => {
  const res = await register(user)

  assert.strictEqual(res.statusCode, 201)

  const body = res.json()
  assert.strictEqual(body.email, 'ada@example.com', 'email deve ser normalizado para minúsculas')
  assert.strictEqual(body.password, undefined, 'senha não pode vazar na resposta')
  assert.strictEqual(body.__v, undefined, 'internals do mongoose não devem vazar')
})

test('email duplicado responde 409, mesmo variando maiúsculas', async () => {
  const res = await register({ ...user, email: 'ADA@example.com' })

  assert.strictEqual(res.statusCode, 409)
})

test('email inválido responde 400 com a mensagem customizada', async () => {
  const res = await register({ ...user, email: 'not-an-email' })

  assert.strictEqual(res.statusCode, 400)
  assert.match(res.json().message, /email/)
})

test('senha curta responde 400', async () => {
  const res = await register({ name: 'x', email: 'short@example.com', password: '123' })

  assert.strictEqual(res.statusCode, 400)
  assert.match(res.json().message, /8 characters/)
})

test('login com credenciais válidas devolve um token JWT', async () => {
  const res = await auth({ email: 'ada@example.com', password: user.password })

  assert.strictEqual(res.statusCode, 200)

  const { token } = res.json()
  const decoded = ctx.app.jwt.verify(token)
  assert.strictEqual(decoded.name, user.name)
})

test('senha errada responde 401', async () => {
  const res = await auth({ email: 'ada@example.com', password: 'wrong-password' })

  assert.strictEqual(res.statusCode, 401)
})

test('email desconhecido responde 401 com a mesma mensagem', async () => {
  const res = await auth({ email: 'ghost@example.com', password: 'whatever-here' })

  assert.strictEqual(res.statusCode, 401)
  assert.match(res.json().message, /Invalid email or password/)
})

test('rate limit do login responde 429 após 5 tentativas no mesmo minuto', async () => {
  // as 3 chamadas acima + estas 2 esgotam o limite de 5
  await auth({ email: 'ada@example.com', password: 'wrong-password' })
  await auth({ email: 'ada@example.com', password: 'wrong-password' })

  const res = await auth({ email: 'ada@example.com', password: user.password })

  assert.strictEqual(res.statusCode, 429)
})
