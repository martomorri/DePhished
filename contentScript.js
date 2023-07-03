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
    console.log(element);
    element.addEventListener("click", function (event) {
      chrome.runtime.sendMessage({ action:"email-click", emailId: element.id });
    });
  });
}

onDOMLoaded();