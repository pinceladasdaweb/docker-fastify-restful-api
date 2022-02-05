const Ajv = require('ajv/dist/2019')

const ajv = new Ajv({
  allErrors: true,
  $data: true
})

require('ajv-errors')(ajv)
require('ajv-formats')(ajv)
require('ajv-keywords')(ajv)

const validatorCompiler = ({ schema }) => ajv.compile(schema)

module.exports = validatorCompiler
