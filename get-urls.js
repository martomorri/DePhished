// In the browser environment

// Function to fetch HTML and extract URLs
function processEmailContent(emailId) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    console.log(emailId);

    // Fetch the email content
    fetch(`https://mail.google.com/mail/u/0/#inbox/${emailId}`)
        .then(response => response.text())
        .then(html => {
            const matches = html.match(urlRegex);
            const urls = matches ? [...new Set(matches)] : [];

            console.log(urls);
        })
        .catch(error => {
            console.error(error);
        });
}

function handleEmailClick(event) {
    const email = event.target.closest('.zA yO');
    console.log(email);
    if (email) {
        const emailId = email.dataset.emailId;
        processEmailContent(emailId);
    }
}

// Attach event listener to email elements
const emailElementsList = document.querySelectorAll('tr[class="zA yO"]');
console.log(emailElementsList);
emailElementsList.forEach(emailElement => {
    emailElement.addEventListener('click', handleEmailClick);
});