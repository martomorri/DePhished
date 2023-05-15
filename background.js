// background.js
// background.js

// Function to fetch HTML and extract URLs
function processEmailContent(emailId) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  console.log(emailId);

  // Fetch the email content
  fetch(`https://mail.google.com/mail/u/0/#inbox/${emailId}`)
    .then(response => response.text())
    .then(html => {
      const matches = html.match(urlRegex);
      const urls = matches ? [...new Set(matches)] : [];

      console.log(urls);
    })
    .catch(error => {
      console.error(error);
    });
}

// Event listener for email click
function handleEmailClick(tab) {
  const emailId = tab.dataset.emailId;
  processEmailContent(emailId);
}

// Add a listener for clicks on Gmail emails
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url.includes('mail.google.com')) {
    console.log(tab);
    chrome.tabs.executeScript(tabId, { file: 'contentScript.js' });
  }
});

// Message listener to receive email ID from content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.emailId) {
    handleEmailClick(request.emailId);
  }
});

// Add an event listener to handle initial page load
chrome.runtime.onInstalled.addListener(function () {
    console.log("hola");
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    if (tab.url.includes('mail.google.com')) {
      chrome.tabs.executeScript(tab.id, { file: 'contentScript.js' });
    }
  });
});
