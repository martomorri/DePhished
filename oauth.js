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
                        fetch(
                            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${element.id}`,
                            init)
                            .then((response) => response.json())
                            .then(function (data) {
                                console.log(data)
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