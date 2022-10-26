// Reacts to POST /hello-world
// eslint-disable-next-line require-await, @typescript-eslint/no-unused-vars
export async function onRequestPost ({ request }) {
  // ...
  return new Response('Hello world')
}
