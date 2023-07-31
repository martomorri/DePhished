let init = {}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'authenticate') {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            console.log(token);
            init = {
                method: 'GET',
                async: true,
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                'contentType': 'json'
            };
            chrome.action.setPopup({ popup: "./popup.html" })
        });
    }
    if (message.action === 'email-click') {
        console.log(message.emailId);
        let urls = "";
        fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.emailId}`, init)
            .then((response) => response.json())
            .then(function (data) {
                let mailBody = "";
                let mailHtml = "";
                if (data.payload.body.size === 0) {
                    mailBody = data.payload.parts[0].body.data;
                    if (data.payload.parts.length > 1) mailHtml = data.payload.parts[1].body.data;
                    if (mailBody === undefined) {
                        mailBody = data.payload.parts[0].parts[0].body.data;
                    }
                } else {
                    mailBody = data.payload.body.data;
                }
                const emailContent = {
                    body: b64DecodeUnicode(mailBody),
                    html: b64DecodeUnicode(mailHtml)
                };
                urls = extractUrlsFromEmail(emailContent);
                urls.forEach(url => {
                    virusTotalRequest(btoa(url));
                });

                chrome.action.setPopup({ popup: "./alert.html" })
            });
    }
    if (message.action === 'reset-popup') {
        console.log(chrome.action)
        chrome.action.setPopup({ popup: "./popup.html" })
    }
});

function b64DecodeUnicode(str) {
    console.log(str);
    if (str === undefined) return "";
    return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
}

function extractUrlsFromEmail(content) {
    const urlRegex = /https?:\/\/[^\s/$.?#].[^'">)?\s]*/g;
    const urls = content.body.match(urlRegex) || content.html.match(urlRegex) || [];
    console.log(urls);
    return urls;
}

function virusTotalRequest(urlEncoded) {
    if (urlEncoded.includes("=")) {
        urlEncoded = urlEncoded.replace(/=/g, '');
    }
    console.log(urlEncoded);
    const options = {
        method: 'GET',
        headers: {
            'x-apikey': '3721d83eb3fe9b8df7c29d9f93ec0052da352e49074b7cd9d2283fb944af400f'
        }
    };

    const url = 'https://www.virustotal.com/api/v3/urls/' + urlEncoded;

    console.log(url);

    fetch(url, options)
        .then(response => response.json())
        .then(function (data) {
            console.log(data);
        })
        .catch(err => console.error(err));
}