window.onload = function () {
    const emailElementOnLoad = document.querySelectorAll(
        'tr[jscontroller="ZdOxDb"]'
    );
    emailElementOnLoad.forEach((element) => {
        let email_element = element.childNodes[4].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
        let email_id = email_element.getAttribute("data-legacy-last-message-id");
        if (!email_id) {
            email_id = email_element.childNodes[0].getAttribute("data-legacy-last-message-id");
        }
        console.log(email_id);
        element.addEventListener("click", function (event) {
            chrome.runtime.sendMessage({ action: "email-click", emailId: email_id });
            chrome.runtime.sendMessage({ action: "open-popup" });
        });
    });
};