function authenticate() {
    chrome.runtime.sendMessage({ action: 'authenticate' });
    close();
}

const authenticateButton = document.getElementById('oauth-button');
if (authenticateButton) authenticateButton.addEventListener('click', authenticate);

const button = document.getElementById("reset-popup")
if (button) button.addEventListener('click', () => { 
    chrome.runtime.sendMessage({ action: 'reset-popup' }) 
    close();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'open-popup') {
        open()
    }
    if (message.action === 'updateEmail') {
        const p = document.createElement("p");
        p.innerHTML = "These are the URLs from this email:";
        document.body.appendChild(p);
        if (message.email_urls) {
            message.email_urls.forEach(url => {
                const urlP = document.createElement("p");
                urlP.innerHTML = url;
                document.body.appendChild(urlP);
            });
        }
        authenticateButton.remove();
    }
});