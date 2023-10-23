function authenticate() {
    chrome.runtime.sendMessage({ action: 'authenticate' })
    close()
}

const authenticateButton = document.getElementById('oauth-button')
if (authenticateButton) authenticateButton.addEventListener('click', authenticate)

const button = document.getElementById('reset-popup')
if (button) button.addEventListener('click', () => { 
    close()
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'open-popup') {
        console.log("hello")
        chrome.windows.create({
            url: message.popup,
            type: 'popup',
            width: 400,
            height: 300,
        })
    }
})