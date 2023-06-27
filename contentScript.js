// contentScript.js
// console.log("hola");

// Function to get the email ID from the Gmail email page
// function getEmailId(element) {
//   // const emailId = element.dataset.emailId;
//   // console.log(element);
//   console.log(element.getAttribute("id"));
//   chrome.runtime.sendMessage({ emailId: element.id });
// }

// Step 1: Create a function to initiate the OAuth flow
// function initiateOAuth() {
//   // Replace these values with your OAuth provider's details
//   const clientId = '947052239706-g002c42fbsvadt1i7h5urm9lq745nivt.apps.googleusercontent.com';
//   const redirectUri = 'YOUR_REDIRECT_URI';
//   const authorizationEndpoint = 'OAUTH_AUTHORIZATION_ENDPOINT';

//   // Construct the authorization URL
//   const authUrl = `${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

//   // Open the authorization URL in a new window or tab
//   window.open(authUrl);
// }

// // Step 2: Create a function to handle the authorization callback
// function handleCallback() {
//   // Retrieve the authorization code from the URL parameters
//   const urlParams = new URLSearchParams(window.location.search);
//   const authorizationCode = urlParams.get('code');

//   // Make a request to your server or OAuth provider's token endpoint to exchange the authorization code for an access token
//   // You can use libraries like Axios or fetch for the HTTP request

//   // Example using Axios:
//   axios.post('TOKEN_ENDPOINT', {
//     code: authorizationCode,
//     client_id: 'YOUR_CLIENT_ID',
//     client_secret: 'YOUR_CLIENT_SECRET',
//     redirect_uri: 'YOUR_REDIRECT_URI',
//     grant_type: 'authorization_code'
//   })
//   .then(response => {
//     // Handle the response and retrieve the access token
//     const accessToken = response.data.access_token;

//     // Store the access token securely, e.g., in local storage or cookies
//     localStorage.setItem('access_token', accessToken);

//     // Redirect or perform any other actions after successful authorization
//     window.location.href = 'SUCCESS_REDIRECT_URL';
//   })
//   .catch(error => {
//     // Handle any errors during the token exchange process
//     console.error('OAuth token exchange error:', error);
//     // Redirect or show an error message to the user
//     window.location.href = 'ERROR_REDIRECT_URL';
//   });
// }

// // Step 3: Call the functions as needed in your application
// // For example, you can bind the initiateOAuth() function to a button click event
// document.getElementById('oauth-button').addEventListener('click', initiateOAuth);

// // Check if the page is the authorization callback page and handle the callback
// if (window.location.pathname === '/callback') {
//   handleCallback();
// }

// function setupMutationObserver() {
//   const observer = new MutationObserver(() => {
//     onDOMLoaded();
//   });

//   observer.observe(document.body, {
//     childList: true,
//     subtree: true
//   });
// }

// function onDOMLoaded () {
//   const emailElementOnLoad = document.querySelectorAll(
//     'tr[jscontroller="ZdOxDb"]'
//   );
//   console.log(emailElementOnLoad);
//   emailElementOnLoad.forEach((element) => {
//     // Add a listener for click events on the email element
//     // console.log(element);
//     element.addEventListener("click", function (event) {
//       chrome.runtime.sendMessage({ emailId: element.id });
//     });
//   });
// }

// onDOMLoaded();

window.onload = function () {
    document.querySelector('button').addEventListener('click', function () {
        chrome.runtime.sendMessage(
            "ok"
        );
    });
};