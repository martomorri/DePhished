window.onload = function () {
    document.querySelector('button').addEventListener('click', function () {
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
            fetch(
                'https://gmail.googleapis.com/gmail/v1/users/me/messages/',
                init)
                .then((response) => response.json())
                .then(function (data) {
                    console.log(data.messages)
                    data.messages.forEach(element => {
                        console.log(element.id)
                        fetch(
                            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${element.id}`,
                            init)
                            .then((response) => response.json())
                            .then(function (data) {
                                let mailBody;
                                let mailHtml;
                                console.log(data);
                                if (data.payload.body.size === 0) { mailBody = data.payload.parts[0].body.data; mailHtml =  data.payload.parts[1].body.data; }
                                else {
                                    mailBody = data.payload.body;
                                }
                                console.log("Text/Plain: " + b64DecodeUnicode(mailBody));
                                console.log("Html: " + b64DecodeUnicode(mailHtml));
                            });
                    });
                });
            fetch(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                init)
                .then((response) => response.json())
                .then(function (data) {
                    console.log(data)
                });
        });
    });
};

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    // ESTO ES HORRIBLE ARREGLAR CON GURU DE JS
    let decoded = "";
    try{
        decoded = decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''))
    }catch(DOMException){
    }

    
    return decoded;

}