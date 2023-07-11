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