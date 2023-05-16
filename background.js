// background.js

// Function to fetch HTML and extract URLs
function processEmailContent(emailId) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  console.log(emailId);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      const url = tabs[0].url;
      console.log(url);
      fetch(url)
        .then((response) => response.text())
        .then((html) => {
          const matches = html.match(urlRegex);
          const urls = matches ? [...new Set(matches)] : [];

          console.log(urls);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });
}

// Add a listener for clicks on Gmail emails
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url.includes("mail.google.com")) {
    console.log(tabId);
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["./contentScript.js"],
    });
  }
});

// Message listener to receive email ID from content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  if (request.emailId) {
    processEmailContent(request.emailId);
  }
});
