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

        const zoneAreas = this.database.getZoneAreas();
        const covers = this.database.getCovers();

        const coverGallery = new Element('DIV', null, {
            elementClass: 'view-double-gallery'
        });

        let names = Object.keys(zoneAreas);
        names.splice(0, 0, 'Cover');

        for (const name of names) {
            const galleryEntry = new Element('DIV', coverGallery, {
                elementClass: 'view-gallery-entry'
            });

            new Element('H2', galleryEntry, {
                elementClass: 'view-gallery-header',
                text: name
            });

            const image = new Element('IMG', galleryEntry, {
                elementClass: 'view-gallery-picture',
                attributes: {
                    'SRC': covers[name]
                }
            });

            new Element('BUTTON', galleryEntry, {
                elementClass: 'view-gallery-button',
                text: 'Upload',
                eventListener: ['click', () => {
                    const filePath = dialog.showOpenDialogSync({
                        properties: ['openFile'],
                        filters: [
                            { name: 'Image', extensions: ['jpg', 'jpeg', 'png' ] }
                        ]
                    });

                    if (filePath) {
                        const raw = this.database.importCover(filePath[0], name);

                        image.element.src = raw;
                    }
                }]
            });
        }

        this.addElement(coverGallery);

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