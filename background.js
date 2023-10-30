chrome.runtime.onInstalled.addListener(() => {
    let init = {}, auth_token = '', email_id = ''
    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        if (message.action === 'authenticate') {
            chrome.identity.getAuthToken({ interactive: true }, function (token) {
                console.log(token)
                token = token
                init = {
                    method: 'GET',
                    async: true,
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    'contentType': 'json'
                }
                chrome.action.setPopup({ popup: './popup.html' })
            });
        }
        if (message.action === 'email-click') {
            console.log(message.emailId)
            email_id = message.emailId
            let urls = '', alert = ''
            try {
                const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.emailId}`, init)
                const data = await response.json()
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
                    html: b64DecodeUnicode(mailHtml),
                }

                urls = extractUrlsFromEmail(emailContent)
                const vtResponses = await Promise.all(urls.map(url => virusTotalRequest(url)))
                alert = await analyseVTResponse(vtResponses)
                chrome.action.setPopup({ popup: alert })
                chrome.runtime.sendMessage({ action: 'open-popup', popup: alert })
            } catch (error) {
                console.error(error)
            }
        }
        if (message.action === 'delete-email') {
            const optionsDelete = {
                method: 'DELETE',
                async: true,
                headers: {
                    Authorization: 'Bearer ' + auth_token,
                    'Content-Type': 'application/json'
                },
                'contentType': 'json'
            }
            fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${email_id}`, optionsDelete)
                .then(
                    chrome.action.setPopup({ popup: './popup.html' })
                )
        }
    })
})

function b64DecodeUnicode(str) {
    if (str === undefined) return ''
    return atob(str.replace(/-/g, '+').replace(/_/g, '/'))
}

function extractUrlsFromEmail(content) {
    const urlRegex = /https?:\/\/[^\s/$.?#][^\s'">)]*/g
    const urls = content.body.match(urlRegex) || content.html.match(urlRegex) || []
    console.log(urls)
    return urls;
}

async function virusTotalRequest(urlToAnalyse) {
    let urlEncoded = btoa(urlToAnalyse)
    if (urlEncoded.includes('=')) {
        urlEncoded = urlEncoded.replace(/=/g, '')
    }
    const optionsGet = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-apikey': '3721d83eb3fe9b8df7c29d9f93ec0052da352e49074b7cd9d2283fb944af400f',
        }
    }

    let url = 'https://www.virustotal.com/api/v3/urls/' + urlEncoded

    try {
        const response = await fetch(url, optionsGet)
        const data = await response.json()

        if (data.error) {
            if (data.error.code === 'QuotaExceededError') {
                return await analyseWithTxt(urlToAnalyse)
            } else {
                const optionsPost = {
                    method: 'POST',
                    headers: {
                        accept: 'application/json',
                        'x-apikey': '3721d83eb3fe9b8df7c29d9f93ec0052da352e49074b7cd9d2283fb944af400f',
                        'content-type': 'application/x-www-form-urlencoded',
                    }
                }

                const postResponse = await fetch('https://www.virustotal.com/api/v3/urls', optionsPost)
                const postResult = await postResponse.json()

                if (postResult.error) {
                    return await analyseWithTxt(urlToAnalyse)
                } else {
                    const start = postResult.data.id.indexOf('-')
                    const end = postResult.data.id.lastIndexOf('-')
                    const id = postResult.data.id.slice(start + 1, end)
                    url = 'https://www.virustotal.com/api/v3/urls/' + id
                    const urlResponse = await fetch(url, optionsGet)
                    const urlData = await urlResponse.json()

                    if (urlData.error) {
                        return await analyseWithTxt(urlToAnalyse)
                    } else {
                        return urlData.data.attributes.last_analysis_stats
                    }
                }
            }
        } else {
            return data.data.attributes.last_analysis_stats
        }
    } catch (error) {
        console.error(error)
        return null
    }
}

async function analyseWithTxt(urlToAnalyse) {
    const urlObjectToAnalyse = new URL(urlToAnalyse)
    let analysis_results = { malicious: 0, suspicious: 0 }

    try {
        const res = await fetch('./assets/urlhaus.abuse.ch.txt')
        const text = await res.text()
        const lines = text.split(/\n/)

        for (const line of lines) {
            if (line.includes(urlObjectToAnalyse.hostname)) {
                analysis_results = { malicious: 1, suspicious: 0 }
                break
            }
        }

        return analysis_results
    } catch (error) {
        console.error(error)
        return analysis_results
    }
}

async function analyseVTResponse(vtResponses) {
    console.log(vtResponses)
    const malicious = vtResponses.some(response => response.malicious > 0)
    const suspicious = vtResponses.some(response => response.suspicious > 5)

    if (malicious) {
        return './malicious.html'
    } else if (suspicious) {
        return './suspicious.html'
    } else {
        return './harmless.html'
    }
}
