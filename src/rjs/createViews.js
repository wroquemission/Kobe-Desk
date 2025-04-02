class CreateTransferDocsView extends View {
    get name() { return 'Transfer Docs'; }

    build() {
        const header = new Element('H1', null, {
            elementClass: 'view-header',
            text: 'Generate Transfer Docs'
        });

        this.addElement(header);

        const comment = new Element('DIV', null, {
            elementClass: 'view-comment',
            text: 'Use this to generate a PDF copy of transfer docs including cover pictures, phone numbers, addresses, area and missionary information, and the transfer calendar.'
        });

        this.addElement(comment);

        const button = new Element('BUTTON', null, {
            elementClass: 'view-button',
            text: 'Generate',
            eventListener: ['click', () => {
                ipcRenderer.sendSync('create-window', 'generate', {
                    show: false,
                    webPreferences: {
                        nodeIntegration: true,
                        enableRemoteModule: true,
                        contextIsolation: false
                    },
                    titleBarStyle: 'hidden',
                    titleBarOverlay: {
                        color: '#292929',
                        symbolColor: '#fff',
                    },
                    minWidth: 600,
                    minHeight: 450,
                    backgroundColor: '#fff',
                });
            }]
        });

        this.addElement(button);
    }
}