const terminate = (server, { coredump = false, timeout = 10000 } = {}) => {
  const exit = code => {
    coredump ? process.abort() : process.exit(code)
  }

  return (code, reason) => err => {
    server.log.warn(`Shutting down: ${reason}`)

    if (err instanceof Error) {
      server.log.error(err)
    }

    setTimeout(() => exit(code), timeout).unref()

    server.close()
      .then(() => exit(code))
      .catch(() => exit(1))
  }
}

module.exports = terminate
