const has = require('./has')
const trim = require('./trim')

const envGetter = (transform) => {
  return (key, defaultValue) => {
    if (!has(process.env, key)) {
      return defaultValue
    }

    const value = process.env[key]
    return transform(value, key)
  }
}

const utils = {
  int: envGetter(value => parseInt(value, 10)),
  float: envGetter(value => parseFloat(value)),
  bool: envGetter(value => value.toLowerCase() === 'true'),
  json: envGetter((value, key) => {
    try {
      return JSON.parse(value)
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON in environment variable ${key}: ${error.message}`)
      }

      throw error
    }
  }),
  array: envGetter(value => {
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.substring(1, value.length - 1)
    }

    return value.split(',').map(v => trim(trim(v, ' '), '"'))
  }),
  date: envGetter((value) => new Date(value))
}

const fromEnv = (key, defaultValue) => {
  return has(process.env, key) ? process.env[key] : defaultValue
}

Object.assign(fromEnv, utils)

module.exports = fromEnv
