addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Request URLs from API
  const url = 'https://cfw-takehome.developers.workers.dev/api/variants'
  // Send the request to server via Fetch
  const response = await fetch(url)

  // Check if valid response
  if(!response.ok){
    throw response
  }

  // Read and modify response to JSON
  const text = await response.text()
  const modified = JSON.parse(text)
  const variantOne = modified["variants"][0]
  const variantTwo = modified["variants"][1]

  // These will be used for the cookie and its data
  const NAME = 'cloudfareFullStack'
  var variant = ''
  const cookie = request.headers.get('cookie')

  // Distribute requests between variants
  // A/B testing with Cookies
  if (cookie && cookie.includes(`${NAME}={variantOne}`)) {
    variant = variantOne
  } else if (cookie && cookie.includes(`${NAME}={variantTwo}`)) {
    variant = variantTwo
  } else {
    // No existing cookie --> 50/50 split using A/B testing
    variant = Math.random() < 0.5 ? variantOne : variantTwo
  }

  // Using selected variant, get its data
  const variantResponse = await fetch(variant)
  const variantText = await variantResponse.text()
  var editedText = ''

  //Changing HTML Code based on Variant
  if(variant == variantOne){
      // Variant One has a link to my LinkedIn profile! Check it out :)
      editedText = variantText.replace('<title>Variant 1</title>', "<title>Welcome to Cloudfare's Variant One</title>")
      editedText = editedText.replace("Variant 1", "<b>Amogh Giri and Cloudfare Present Variant One!</b>")
      editedText = editedText.replace("This is variant one of the take home project!",
        "<i>Variant One was chosen for you using a cookie and A/B testing!</i>")
      editedText = editedText.replace("https://cloudflare.com", "https://www.linkedin.com/in/amogh-giri01/")
      editedText = editedText.replace("Return to cloudflare.com", "Click here to take a visit to Amogh's LinkedIn")
  }else{
      // Variant Two has a link to my GitHub profile! Check it out :)
      editedText = variantText.replace('<title>Variant 2</title>', "<title>Welcome to Cloudfare's Variant Two</title>")
      editedText = editedText.replace("Variant 2", "<b>Amogh Giri and Cloudfare Present Variant Two!</b>")
      editedText = editedText.replace("This is variant two of the take home project!",
        "<i>Variant Two was chosen for you using a cookie and A/B testing!</i>")
      editedText = editedText.replace("https://cloudflare.com", "https://github.com/Amgg12301")
      editedText = editedText.replace("Return to cloudflare.com", "Click here to check out some cool code Amogh has written!")
  }

  // Creating response and setting its cookie
  var responseWithCookie = new Response(editedText, {
    headers: { 'content-type': 'text/html' },
  })
  responseWithCookie.headers.append('Set-Cookie', `${NAME}=${variant}; path=/`)

  return responseWithCookie
}
