function authenticate() {
    chrome.runtime.sendMessage({ action: 'authenticate' })
    close()
    // openPopup('./popup.html')
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
    // open(popup, '_self', 'popup')
    chrome.windows.create({
        url: popup,
        type: 'popup',
        width: 340,
        height: 355,
        left: 1450,
        top: 50
    })
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'reload') {
        location.reload()
    }
})