// eslint-disable-next-line no-trailing-spaces
const errorHandler = async ({ next }) => {
  try {
    return await next()
  } catch (err) {
    return new Response(`${err.message}\n${err.stack}`, { status: 500 })
  }
}

class HealthPageRewriter {
  _markup: string
  constructor (markup: string) {
    this._markup = markup
  }

  element (element: Element) {
    // const markup = '<div><marquee>Lennox is great</marquee></div>'
    // element.setInnerContent(markup, { html: true })
    element.setInnerContent(this._markup, { html: true })
  }
}

class Vue3PageRewriter {
  element (element: Element): void | Promise<void> {
    if (element.tagName === 'head') {
      element.remove()
    }
    if (element.tagName === 'html') {
      element.removeAndKeepContent()
    }
  }
}

const intercept = async ({ next }) => {
  const init = {
    headers: {
      'content-type': 'text/html;charset=UTF-8'
    }
  }

  const response = await next()

  const vue3Page = await fetch('https://vue3application.pages.dev/', init)
  const vue3PageMarkup = await vue3Page.text()

  response.headers.set('X-Lennox', 'You have been modified')

  const vue3PageMarkupWithoutHead = await new HTMLRewriter()
    .on('*', new Vue3PageRewriter())
    .transform(
      new Response(vue3PageMarkup, {
        headers: [['content-type', 'text/html;charset=UTF-8']]
      })
    )
    .text()

  return new HTMLRewriter()
    .on('#holder', new HealthPageRewriter(vue3PageMarkupWithoutHead))
    .transform(response)
}

export const onRequest = [errorHandler, intercept]
