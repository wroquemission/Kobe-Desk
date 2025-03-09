const { dialog } = require('@electron/remote');
const XLSX = require('xlsx');
const fs = require('fs');

class ImportRosterView extends View {
    get name() { return 'Roster'; }

    build() {
        const header = new Element('H1', null, {
            elementClass: 'view-header',
            text: 'Import Roster'
        });

        this.addElement(header);

        const comment = new Element('DIV', null, {
            elementClass: 'view-comment',
            text: 'From here, you can import the Missionary Portal roster spreadsheet (.xlsx). In no particular order, you should include the fields for =Missionary=, =ID=, =Type=, =Assignment=, =Status=, =Arrival Date=, =Release Date=, =Area=, =District=, and =Zone=.'
        });

        this.addElement(comment);

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

class ImportAddressesView extends View {
    get name() { return 'Addresses'; }

    build() {
        const header = new Element('H1', null, {
            elementClass: 'view-header',
            text: 'Import Addresses'
        });

        this.addElement(header);

        const comment = new Element('DIV', null, {
            elementClass: 'view-comment',
            text: 'From here, you can import a spreadsheet containing apartment addresses (.xlsx). In no particular order, you should include fields for =Name= (a label for the apartment), =Postal Code=, =Japanese Address=, and =English Address=.'
        });

        this.addElement(comment);

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

                    this.database.importAddresses(data);
                }
            }]
        });

        this.addElement(button);
    }
}

class ImportAddressKeyView extends View {
    get name() { return 'Address Key'; }

    build() {
        const header = new Element('H1', null, {
            elementClass: 'view-header',
            text: 'Import Address Key'
        });

        this.addElement(header);

        const comment = new Element('DIV', null, {
            elementClass: 'view-comment',
            text: 'From here, you can import a spreadsheet that associates apartment names with area names (.xlsx). In no particular order, you should include fields for =Areas= and =Apartment=. Each row should have one area pointing to one apartment label.'
        });

        this.addElement(comment);

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

                    this.database.importAddressKey(data);
                }
            }]
        });

        this.addElement(button);
    }
}