let init = {}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'authenticate') {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            console.log(token)
            init = {
                method: 'GET',
                async: true,
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                'contentType': 'json'
            };
            chrome.action.setPopup({ popup: './popup.html' })
        });
    }
    if (message.action === 'email-click') {
        console.log(message.emailId)
        let urls = ''
        fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.emailId}`, init)
            .then((response) => response.json())
            .then(function (data) {
                let mailBody = ''
                let mailHtml = ''
                if (data.payload.body.size === 0) {
                    mailBody = data.payload.parts[0].body.data
                    if (data.payload.parts.length > 1) mailHtml = data.payload.parts[1].body.data
                    if (mailBody === undefined) {
                        mailBody = data.payload.parts[0].parts[0].body.data
                    }
                } else {
                    mailBody = data.payload.body.data
                }
                const emailContent = {
                    body: b64DecodeUnicode(mailBody),
                    html: b64DecodeUnicode(mailHtml)
                }
                urls = extractUrlsFromEmail(emailContent)
                vtResponses = []
                urls.forEach(url => {
                    vtResponses.push(virusTotalRequest(url))
                });
                const alert = analyseVTResponse(vtResponses) ? './malicious.html' : './harmless.html'
                chrome.action.setPopup({ popup: alert })
            });
    }
    if (message.action === 'reset-popup') {
        chrome.action.setPopup({ popup: './popup.html' })
    }
});

function b64DecodeUnicode(str) {
    if (str === undefined) return ''
    return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
}

function extractUrlsFromEmail(content) {
    const urlRegex = /https?:\/\/[^\s/$.?#].[^'">)?\s]*/g;
    const urls = content.body.match(urlRegex) || content.html.match(urlRegex) || []
    console.log(urls)
    return urls
}

async function virusTotalRequest(urlToAnalyse) {
    let urlEncoded = btoa(urlToAnalyse)
    if (urlEncoded.includes('=')) {
        urlEncoded = urlEncoded.replace(/=/g, '')
    }
    const optionsGet = {
        method: 'GET',
        headers: {
            'x-apikey': '3721d83eb3fe9b8df7c29d9f93ec0052da352e49074b7cd9d2283fb944af400f'
        }
    }

    let url = 'https://www.virustotal.com/api/v3/urls/' + urlEncoded

    let analysis_results

    fetch(url, optionsGet)
        .then(response => response.json())
        .then(function (data) {
            if (data.error) {
                if (data.error.code === 'QuotaExceededError') {
                    return { error: 'vt not working' }
                    // fetch('./assets/malicious-url-list.txt')
                    //     .then(res = res.text())
                    //     .then(content => {
                    //         let lines = content.split(/\n/)
                    //         lines.forEach(line => {
                    //             if (line.includes(urlToAnalyse)) analysis_results = { malicious: 1, suspicious: 0 }
                    //         })
                    //     })
                }
                else {
                    const optionsPost = {
                        method: 'POST',
                        headers: {
                            accept: 'application/json',
                            'x-apikey': '3721d83eb3fe9b8df7c29d9f93ec0052da352e49074b7cd9d2283fb944af400f',
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        body: new URLSearchParams({ url: urlToAnalyse })
                    };

                    fetch('https://www.virustotal.com/api/v3/urls', optionsPost)
                        .then(response => response.json())
                        .then(response => {
                            console.log(response)
                            const start = response.data.id.indexOf('-')
                            const end = response.data.id.lastIndexOf('-')
                            const id = response.data.id.slice(start+1, end)
                            url = 'https://www.virustotal.com/api/v3/urls/' + id
                            fetch(url, optionsGet)
                                .then(response => response.json())
                                .then(function (data) {
                                    console.log(data)
                                    analysis_results = data.data.attributes.last_analysis_stats
                                })
                        })
                        .catch(err => console.error(err));
                }
            }
            else {
                console.log(data.data.attributes.last_analysis_stats)
                analysis_results = data.data.attributes.last_analysis_stats
            }
        })
        .catch(err => console.error(err))
        .finally(() => {
            return analysis_results
        })
}

function analyseVTResponse(vtResponses) {
    vtResponses.map(r => {
        if (r.error) return false
        else if (r.malicious > 0 || r.suspicious > 0) return false
    })
    return true
}