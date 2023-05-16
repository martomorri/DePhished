// contentScript.js
// console.log("hola");

// Function to get the email ID from the Gmail email page
// function getEmailId(element) {
//   // const emailId = element.dataset.emailId;
//   // console.log(element);
//   console.log(element.getAttribute("id"));
//   chrome.runtime.sendMessage({ emailId: element.id });
// }

function setupMutationObserver() {
  const observer = new MutationObserver(() => {
    onDOMLoaded();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function onDOMLoaded () {
  const emailElementOnLoad = document.querySelectorAll(
    'tr[jscontroller="ZdOxDb"]'
  );
  console.log(emailElementOnLoad);
  emailElementOnLoad.forEach((element) => {
    // Add a listener for click events on the email element
    // console.log(element);
    element.addEventListener("click", function (event) {
      chrome.runtime.sendMessage({ emailId: element.id });
    });
  });
}

onDOMLoaded();