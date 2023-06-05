// background.js

// function get_access_token_using_saved_refresh_token() {
//   // from the oauth playground
//   const refresh_token = "1//04_cc5qm7E_XlCgYIARAAGAQSNwF-L9IrZnzKPpViktcb73RZttyv6Vw4vWOqZFRN6v4baHCFck-61qvUCzf3lFTANqcEuDQOH4s";
//   // from the API console
//   const client_id = "947052239706-mcj2mvdr5sg6fvol847q6u9mbulb8hb3.apps.googleusercontent.com";
//   // from the API console
//   const client_secret = "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";
//   // from https://developers.google.com/identity/protocols/OAuth2WebServer#offline
//   const refresh_url = "https://www.googleapis.com/oauth2/v4/token";

//   const post_body = `grant_type=refresh_token&client_id=${encodeURIComponent(client_id)}&client_secret=${encodeURIComponent(client_secret)}&refresh_token=${encodeURIComponent(refresh_token)}`;

//   let refresh_request = {
//       body: post_body,
//       method: "POST",
//       headers: new Headers({
//           'Content-Type': 'application/x-www-form-urlencoded'
//       })
//   }

//   // post to the refresh endpoint, parse the json response and use the access token to call files.list
//   fetch(refresh_url, refresh_request).then( response => {
//           return(response.json());
//       }).then( response_json =>  {
//           console.log(response_json);
//           return response_json.access_token;
//           // files_list(response_json.access_token);
//   });
// }

// // Retrieve emails
// function retrieveEmails() {
//   const accessToken = get_access_token_using_saved_refresh_token(); // Replace with the access token obtained through OAuth 2.0
//   console.log(accessToken);

//   fetch('https://www.googleapis.com/gmail/v1/users/me/messages', {
//     headers: {
//       Authorization: `Bearer ${accessToken}`
//     }
//   })
//     .then(response => response.json())
//     .then(data => {
//       console.log(data);
//       const messages = data.messages;
//       // console.log(messages);
//       messages.forEach(message => {
//         retrieveEmailContent(message.id);
//       });
//     })
//     .catch(error => {
//       console.error('Error retrieving emails:', error);
//     });
// }

// // Retrieve email content
// function retrieveEmailContent(emailId) {
//   const accessToken = get_access_token_using_saved_refresh_token(); // Replace with the access token obtained through OAuth 2.0

//   fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}`, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`
//     }
//   })
//     .then(response => response.json())
//     .then(data => {
//       const email = data;
//       const content = email.payload.body.data; // Assuming the email content is in the `body.data` field

//       // Extract URLs from email content using a regular expression
//       const urls = extractUrlsFromEmail(content);

//       // Do something with the URLs
//       console.log(urls);
//     })
//     .catch(error => {
//       console.error('Error retrieving email content:', error);
//     });
// }

// // Extract URLs from email content
// function extractUrlsFromEmail(content) {
//   const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
//   const urls = content.match(urlRegex) || [];
//   return urls;
// }

// // Register the service worker
// chrome.runtime.onInstalled.addListener(() => {
//   retrieveEmails();
// });