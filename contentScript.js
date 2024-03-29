window.onload = loadElements;
document.body.addEventListener('click', loadElements, true);

function loadElements() {
    const emailList = document.querySelectorAll('tr[jscontroller="ZdOxDb"]');
    emailList.forEach((element) => {
        element.removeEventListener('click', clickListener);
    });

    emailList.forEach((element) => {
        element.addEventListener('click', clickListener);
    });

    console.log("Finished charging");
}

function clickListener(event) {
    const emailElement = event.currentTarget;
    const email_id = emailElement.querySelector('[data-legacy-last-message-id]').getAttribute('data-legacy-last-message-id');
    chrome.runtime.sendMessage({ action: 'email-click', emailId: email_id });
}
