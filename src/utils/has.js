const has = (obj, path) => {
  const pathTypes = {
    string: () => path.match(/([^[.\]])+/g),
    object: () => Array.isArray(path) ? path : undefined
  }

  const pathArray = pathTypes[typeof path]?.()

  if (pathArray === undefined) {
    throw new TypeError('Path should be either a string or an array')
  }

  return !!pathArray.reduce((prevObj, key) => prevObj && prevObj[key], obj)
}

module.exports = has
