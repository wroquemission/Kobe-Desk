const { ipcRenderer } = require("electron");

const logElement = document.querySelector('#log');


ipcRenderer.on('append-warning', (event, warning) => {
    const logEntry = document.createElement('DIV');

    logEntry.innerText = warning;
    logEntry.classList.add('log-entry');
    
    logElement.appendChild(logEntry);
});