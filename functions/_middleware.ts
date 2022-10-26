const htmlString = '<marquee><h1>Lennox is great</h1></marquee>'

// eslint-disable-next-line no-trailing-spaces
const errorHandler = async ({ next }) => {
  try {
    return await next()
  } catch (err) {
    return new Response(`${err.message}\n${err.stack}`, { status: 500 })
  }
}

class HealthPageRewriter {
  element (span: Element) {
    span.append(htmlString, { html: true })
  }
}

const intercept = async ({ next }) => {
  const response = await next()
  response.headers.set('X-Lennox', 'You have been modified')

  const rewriter = new HTMLRewriter()
    .on('span', new HealthPageRewriter())

  return rewriter.transform(response)
}

export const onRequest = [errorHandler, intercept]

// const contentType = response.headers.get('Content-Type')
