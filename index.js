addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = 'https://cfw-takehome.developers.workers.dev/api/variants'
  // Send the request on to the origin server.
  const response = await fetch(url)

  if(!response.ok){
    throw response
  }

  // Read response body.
  const text = await response.text()

  // Modify it.
  const modified = JSON.parse(text)
  const variantOne = modified["variants"][0]
  const variantTwo = modified["variants"][1]

  const NAME = 'cloudfareFullStack'
  var variant = ''
  const cookie = request.headers.get('cookie')

  if (cookie && cookie.includes(`${NAME}={variantOne}`)) {
    variant = variantOne
  } else if (cookie && cookie.includes(`${NAME}={variantTwo}`)) {
    variant = variantTwo
  } else {
    // if no cookie then this is a new client, decide a group and set the cookie
    variant = Math.random() < 0.5 ? variantOne : variantTwo // 50/50 split
    console.log(variant)
  }

  const variantResponse = await fetch(variant)
  const variantText = await variantResponse.text()
  var editedText = ''
  if(variant == variantOne){
      editedText = variantText.replace('<title>Variant 1</title>', "<title>Welcome to Cloudfare's Variant One</title>")
      editedText = editedText.replace("Variant 1", "<b>Amogh Giri and Cloudfare Present Variant One!</b>")
      editedText = editedText.replace("This is variant one of the take home project!",
        "<i>Variant One was chosen for you using a cookie and A/B testing!</i>")
      editedText = editedText.replace("https://cloudflare.com", "https://www.linkedin.com/in/amogh-giri01/")
      editedText = editedText.replace("Return to cloudflare.com", "Let's take a visit to Amogh's LinkedIn")
  }else{
      editedText = variantText.replace('<title>Variant 2</title>', "<title>Welcome to Cloudfare's Variant Two</title>")
      editedText = editedText.replace("Variant 2", "<b>Amogh Giri and Cloudfare Present Variant Two!</b>")
      editedText = editedText.replace("This is variant two of the take home project!",
        "<i>Variant Two was chosen for you using a cookie and A/B testing!</i>")
      editedText = editedText.replace("https://cloudflare.com", "https://github.com/Amgg12301")
      editedText = editedText.replace("Return to cloudflare.com", "Time to check out some cool code Amogh has written!")
  }
  console.log(editedText)
  var responseWithCookie = new Response(editedText, {
    headers: { 'content-type': 'text/html' },
  })
  responseWithCookie.headers.append('Set-Cookie', `${NAME}=${variant}; path=/`)

  return responseWithCookie
}
