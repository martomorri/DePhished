function authenticate() {
    chrome.runtime.sendMessage({ action: 'authenticate' })
    close()
}

function deleteEmail() {
    chrome.runtime.sendMessage({ action: 'delete-email' })
    close()
}

const authenticateButton = document.getElementById('oauth-button')
if (authenticateButton) authenticateButton.addEventListener('click', authenticate)

const acceptButton = document.getElementById('acceptButton')
if (acceptButton) acceptButton.addEventListener('click', () => { 
    close()
})

const deleteButton = document.getElementById('deleteButton')
if (deleteButton) deleteButton.addEventListener('click', deleteEmail)

function openPopup(popup) {
    chrome.windows.create({
        url: popup,
        type: 'popup',
        width: 400,
        height: 300,
    })
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'open-popup') {
        openPopup(message.popup)
    }
})