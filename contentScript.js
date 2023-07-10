window.onload = function () {
    const emailElementOnLoad = document.querySelectorAll(
        'tr[jscontroller="ZdOxDb"]'
    );
    // console.log(emailElementOnLoad);
    emailElementOnLoad.forEach((element) => {
        let email_element = element.childNodes[4].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
        let email_id = email_element.getAttribute("data-legacy-last-message-id");
        if (!email_id) {
            email_id = email_element.childNodes[0].getAttribute("data-legacy-last-message-id");
        }
        console.log(email_id);
        element.addEventListener("click", function (event) {
            // chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
            //     chrome.scripting.executeScript({
            //         target: { tabId: tab_id }, // Specify the active tab where you want to inject the dynamic content
            //         function: displayDynamicContent
            //     });
            // });
            chrome.runtime.sendMessage({ action: "email-click", emailId: email_id });
        });
    });
};