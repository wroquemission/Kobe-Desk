const { dialog } = require('@electron/remote');
const XLSX = require('xlsx');
const fs = require('fs');

class ImportRosterView extends View {
    get name() { return 'Roster'; }

    build() {
        const button = new Element('BUTTON', null, {
            elementClass: 'view-button',
            text: 'Select File',
            eventListener: ['click', () => {
                const path = dialog.showOpenDialogSync({
                    properties: ['openFile'],
                    filters: [ { name: 'Excel Spreadsheet (.xlsx)', extensions: ['xlsx'] } ]
                });

                if (path) {
                    const file = fs.readFileSync(path[0]);
                    const workbook = XLSX.read(file);

                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const data = XLSX.utils.sheet_to_json(firstSheet);

                    this.database.importTable(data);
                }
            }]
        });

        this.addElement(button);
    }
}
