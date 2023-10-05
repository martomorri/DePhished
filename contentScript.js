window.onload = loadElements()
document.body.addEventListener('click', loadElements, true)

function loadElements() {
    const emailElementOnLoad = document.querySelectorAll(
        'tr[jscontroller="ZdOxDb"]'
    );
    emailElementOnLoad.forEach((element) => {
        let email_element = element.childNodes[4].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
        let email_id = email_element.getAttribute('data-legacy-last-message-id')
        if (!email_id) {
            email_id = email_element.childNodes[0].getAttribute('data-legacy-last-message-id')
        }
        element.removeEventListener('click', () => listener(email_id));
        element.addEventListener('click', () => listener(email_id));
    })
    console.log("Finished charging")
}

function listener (email_id) {
    chrome.runtime.sendMessage({ action: 'email-click', emailId: email_id })
    // chrome.runtime.sendMessage({ action: 'open-popup' })
}