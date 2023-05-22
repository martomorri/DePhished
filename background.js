// background.js

// gapi.load('client:auth2', initGmailAPI);

// function initGmailAPI() {
//   // Initialize the API client with your credentials
//   gapi.client.init({
//     apiKey: 'AIzaSyDq9pYcbAqfxIzdb9HDtr6yjRK8m0nnF4I',
//     client_id:"1004627308525-h9viadg79jbgheb034t9r4rs7ctmncb8.apps.googleusercontent.com",
//     discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
//     scope: 'https://www.googleapis.com/auth/gmail.readonly'
//   }).then(() => {
//     // Authorize the user
//     return gapi.auth2.getAuthInstance().signIn();
//   }).then(() => {
//     // The user has granted authorization, you can now make Gmail API requests
//     // For example, retrieve emails, send emails, etc.
//     console.log("Authorized");
//   }).catch(error => {
//     console.log('Error:', error);
//   });
// }

// // Function to fetch HTML and extract URLs
// // function processEmailContent(emailId) {
// //   const urlRegex = /(https?:\/\/[^\s]+)/g;
// //   console.log(emailId);
// //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
// //     if (tabs && tabs.length > 0) {
// //       const url = tabs[0].url;
// //       console.log(url);
// //       fetch(url)
// //         .then((response) => response.text())
// //         .then((html) => {
// //           const matches = html.match(urlRegex);
// //           const urls = matches ? [...new Set(matches)] : [];

// //           console.log(urls);
// //         })
// //         .catch((error) => {
// //           console.error(error);
// //         });
// //     }
// //   });
// // }

// function extractUrlsFromEmail(email) {
//   const content = email.payload.body.data; // Assuming the email content is in the `body.data` field

//   // Regular expression to match URLs
//   const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;

//   const urls = content.match(urlRegex) || []; // Extract URLs from content using the regular expression

//   return urls;
// }

// function getEmailContent(token, emailId) {
//   fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}`, {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   })
//     .then(response => response.json())
//     .then(email => {
//       // Extract URLs from email content
//       const urls = extractUrlsFromEmail(email);

//       // Do something with the URLs
//       console.log(urls);
//     })
//     .catch(error => {
//       console.error(error);
//     });
// }

// // Add a listener for clicks on Gmail emails
// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   if (changeInfo.status === "complete" && tab.url.includes("mail.google.com")) {
//     console.log(tabId);
//     chrome.scripting.executeScript({
//       target: { tabId: tabId },
//       files: ["./contentScript.js"],
//     });
//   }
// });

// // Message listener to receive email ID from content script
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log(request);
//   if (request.emailId) {
//     authorize(token => {
//       getEmailContent(token, reques.emailId); // Replace 'EMAIL_ID' with the email ID you want to retrieve
//     });
//   }
// });

// background.js

function get_access_token_using_saved_refresh_token() {
  // from the oauth playground
  const refresh_token = "1//04XBP-JhCLwOLCgYIARAAGAQSNwF-L9IrhCkmtC4rqxvNw0RfidsESsmzjL3yhq867svkkPhnTbHBhOAwPCMz_O8TVPAwVQWVaaQ";
  // from the API console
  const client_id = "827030144364-1j1pj9847gtr8sc93j8u2qocd6hmc9hr.apps.googleusercontent.com";
  // from the API console
  const client_secret = "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";
  // from https://developers.google.com/identity/protocols/OAuth2WebServer#offline
  const refresh_url = "https://www.googleapis.com/oauth2/v4/token";

  const post_body = `grant_type=refresh_token&client_id=${encodeURIComponent(client_id)}&client_secret=${encodeURIComponent(client_secret)}&refresh_token=${encodeURIComponent(refresh_token)}`;

  let refresh_request = {
      body: post_body,
      method: "POST",
      headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded'
      })
  }

  // post to the refresh endpoint, parse the json response and use the access token to call files.list
  fetch(refresh_url, refresh_request).then( response => {
          return(response.json());
      }).then( response_json =>  {
          console.log(response_json);
          return response_json.access_token;
          // files_list(response_json.access_token);
  });
}

// Retrieve emails
function retrieveEmails() {
  const accessToken = get_access_token_using_saved_refresh_token(); // Replace with the access token obtained through OAuth 2.0
  console.log(accessToken);

  fetch('https://www.googleapis.com/gmail/v1/users/me/messages', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const messages = data.messages;
      // console.log(messages);
      messages.forEach(message => {
        retrieveEmailContent(message.id);
      });
    })
    .catch(error => {
      console.error('Error retrieving emails:', error);
    });
}

// Retrieve email content
function retrieveEmailContent(emailId) {
  const accessToken = get_access_token_using_saved_refresh_token(); // Replace with the access token obtained through OAuth 2.0

  fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
    .then(response => response.json())
    .then(data => {
      const email = data;
      const content = email.payload.body.data; // Assuming the email content is in the `body.data` field

      // Extract URLs from email content using a regular expression
      const urls = extractUrlsFromEmail(content);

      // Do something with the URLs
      console.log(urls);
    })
    .catch(error => {
      console.error('Error retrieving email content:', error);
    });
}

// Extract URLs from email content
function extractUrlsFromEmail(content) {
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
  const urls = content.match(urlRegex) || [];
  return urls;
}

// Register the service worker
chrome.runtime.onInstalled.addListener(() => {
  retrieveEmails();
});
