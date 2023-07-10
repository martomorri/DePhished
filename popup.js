function authenticate() {
    chrome.runtime.sendMessage({ action: 'authenticate' });
}

const authenticateButton = document.getElementById('oauth-button');
authenticateButton.addEventListener('click', authenticate);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'authenticationComplete') {
        const p = document.createElement("p");
        p.innerHTML = "Welcome to DePhished!";
        document.body.appendChild(p);
        authenticateButton.remove();
    }
});

// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//     if (message.action === 'generatePopup') {
//         console.log("hello");
//         chrome.scripting.executeScript({
//             target: { tabId: message.tabId }, // Specify the active tab where you want to inject the dynamic content
//             function: displayDynamicContent
//         });
//     }
// });

// function displayDynamicContent() {
//     const p = document.createElement('p');
//     p.innerHTML = "Hola soy una alerta";
//     document.body.appendChild(p);
// }