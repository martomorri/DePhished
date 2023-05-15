// contentScript.js

// Function to get the email ID from the Gmail email page
function getEmailId(element) {
    const emailId = element.dataset.emailId;
    chrome.runtime.sendMessage({ emailId: emailId });
  }
  
  // Add a listener for click events on the email element
  document.addEventListener('click', function (event) {
    const emailElement = event.target.closest('.email-class'); // Replace with the appropriate selector to target the email element
    if (emailElement) {
      getEmailId(emailElement);
    }
  });
  
  // Call the getEmailId function to retrieve the email ID if needed on page load
  const emailElementOnLoad = document.querySelector('.email-class'); // Replace with the appropriate selector to target the email element
  if (emailElementOnLoad) {
    getEmailId(emailElementOnLoad);
  }
  