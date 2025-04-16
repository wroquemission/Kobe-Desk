const messagePrompt = document.querySelector('#status-message');

document.body.addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') {
        messagePrompt.classList.add('hide');
    }
}, false);

function showMessage(message) {
    messagePrompt.innerHTML = message;
    messagePrompt.classList.remove('hide');
}