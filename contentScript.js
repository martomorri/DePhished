window.onload = loadElements;
document.body.addEventListener('click', loadElements, true);

function loadElements() {
    // Elimina todos los oyentes en la lista de correos electrónicos
    const emailList = document.querySelectorAll('tr[jscontroller="ZdOxDb"]');
    emailList.forEach((element) => {
        element.removeEventListener('click', clickListener);
    });

    // Agrega nuevos oyentes a la lista de correos electrónicos
    emailList.forEach((element) => {
        element.addEventListener('click', clickListener);
    });

    console.log("Finished charging");
}

function clickListener(event) {
    // Lógica para el evento de clic
    const emailElement = event.currentTarget;
    const email_id = emailElement.querySelector('[data-legacy-last-message-id]').getAttribute('data-legacy-last-message-id');
    chrome.runtime.sendMessage({ action: 'email-click', emailId: email_id });
    // Otra lógica específica para el evento de clic
}
