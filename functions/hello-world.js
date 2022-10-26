// Reacts to GET /hello-world
// eslint-disable-next-line require-await, @typescript-eslint/no-unused-vars
export async function onRequestGet ({ request }) {
  // ...
  return new Response('Hello world')
}
