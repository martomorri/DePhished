chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'authenticate') {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            console.log(token);
            let init = {
                method: 'GET',
                async: true,
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                'contentType': 'json'
            };
            chrome.runtime.sendMessage({ action: 'authenticationComplete', data: token });
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                if (message.action === 'email-click') {
                    console.log(message.emailId);
                    fetch(
                        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.emailId}`,
                        init)
                        .then((response) => response.json())
                        .then(function (data) {
                            let mailBody;
                            let mailHtml;
                            console.log(data);
                            if (data.payload.body.size === 0) { mailBody = data.payload.parts[0].body.data; mailHtml = data.payload.parts[1].body.data; }
                            else {
                                mailBody = data.payload.body;
                            }
                            // console.log("Text/Plain: " + b64DecodeUnicode(mailBody));
                            // console.log("Html: " + b64DecodeUnicode(mailHtml));
                            const emailContent = {
                                body: b64DecodeUnicode(mailBody),
                                html: b64DecodeUnicode(mailHtml)
                            }
                            extractUrlsFromEmail(emailContent);
                        });
                }
            });
        });
    }
});

function b64DecodeUnicode(str) {
    return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
}

function extractUrlsFromEmail(content) {
    const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
    const urls = content.body.match(urlRegex) || content.html.match(urlRegex) || [];
    console.log(urls);
    return urls;
}  