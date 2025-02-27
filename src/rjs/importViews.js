const { dialog } = require('@electron/remote');

class ImportRosterView extends View {
    get name() { return 'Roster'; }

    constructor() {
        super();
    }

    build() {
        const button = new Element('BUTTON', null, {
            elementClass: 'view-button',
            text: 'Select File',
            eventListener: ['click', () => {
                dialog.showOpenDialogSync({
                    properties: ['openFile'],
                    filters: [ { name: 'Excel Spreadsheet (.xlsx)', extensions: ['xlsx'] } ]
                });
            }]
        });

        this.addElement(button);
    }
}
