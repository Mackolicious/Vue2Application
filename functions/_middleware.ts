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
  _markup: string
  constructor (markup: string) {
    this._markup = markup
  }

  element (span: Element) {
    span.setInnerContent(this._markup, { html: true })
  }
}

// class Vue3PageRewriter implements HTMLRewriterDocumentContentHandlers {
//   element (element: Element): void | Promise<void> {
//     if (element.tagName === 'head') {
//       element.remove()
//     }
//     if (element.tagName === 'html') {
//       element.removeAndKeepContent()
//     }
//   }

//   comments (comment: Comment): void | Promise<void> {
//     // eslint-disable-next-line no-console
//     console.log('comments')
//   }

//   end (end: DocumentEnd): void | Promise<void> {
//     // eslint-disable-next-line no-console
//     console.log('end')
//   }
// }

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

  // const vue3PageMarkupWithoutBody = await new HTMLRewriter()
  //   .onDocument(new Vue3PageRewriter())
  //   .transform(new Response(vue3PageMarkup, { headers: [['content-type', 'text/html;charset=UTF-8']] }))
  //   .text()
  // return vue3PageMarkupWithoutBody
  // const newMarkup = `<iframe>${vue3PageMarkupWithoutBody}</iframe>`

  // return new HTMLRewriter()
  //   .on('#holder', new HealthPageRewriter(vue3PageMarkupWithoutBody))
  //   .transform(response)

  return await new HTMLRewriter()
    .on('*', new Vue3PageRewriter())
    .transform(response.clone())
}

export const onRequest = [errorHandler, intercept]

// const contentType = response.headers.get('Content-Type')
