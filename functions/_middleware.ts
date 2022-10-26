const htmlString = '<marquee><h1>Lennox is great</h1></marquee>'

// eslint-disable-next-line no-trailing-spaces
const errorHandler = async ({ next }) => {
  try {
    return await next()
  } catch (err) {
    return new Response(`${err.message}\n${err.stack}`, { status: 500 })
  }
}

class TextRewriter implements HTMLRewriterElementContentHandlers {
  element (text: Element) {
    text.append(htmlString, { html: true })
  }
}

const rewriter = new HTMLRewriter()
  .on('text', new TextRewriter())

const intercept = async ({ next }) => {
  const response = await next()
  response.headers.set('X-Lennox', 'You have been modified')

  // const contentType = response.headers.get('Content-Type');
  return rewriter.transform(response)
}

export const onRequest = [errorHandler, intercept]
