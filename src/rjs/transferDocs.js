const database = new Database();
database.loadData();

const contentElement = new Element('DIV', document.body, {
    ID: 'content'
});

new Element('H1', contentElement, {
    elementClass: 'section-title',
    text: 'Phone List'
});

const phoneListSection = new Element('DIV', contentElement, {
    elementClass: 'section'
});

function sortObject(unordered) {
    return Object.keys(unordered).sort().reduce(
        (obj, key) => {
            obj[key] = unordered[key];
            return obj;
        },
        {}
    );
}

let phoneIndex = {};

for (const number of Object.values(database.numbers)) {
    if (number.group in phoneIndex) {
        phoneIndex[number.group].push(number);
    } else {
        phoneIndex[number.group] = [number];
    }
}

phoneIndex = sortObject(phoneIndex);

for (const group in phoneIndex) {
    const table = new Element('TABLE', contentElement, {
        elementClass: 'phone-table'
    });

    const headerRow = new Element('TR', table, {
        elementClass: 'phone-table-header-row'
    });

    new Element('TH', headerRow, {
        elementClass: 'phone-table-header',
        text: group,
        attributes: {
            colspan: 2
        }
    });

    for (const number of phoneIndex[group]) {
        const row = new Element('TR', table, {
            elementClass: 'phone-table-row'
        });

        new Element('TD', row, {
            elementClass: 'phone-table-row-name',
            text: number.name
        });

        new Element('TD', row, {
            elementClass: 'phone-table-row-number',
            text: number.number
        });
    }
}

new Element('H1', contentElement, {
    elementClass: 'section-title',
    text: 'Address List'
});

const addressListSection = new Element('DIV', contentElement, {
    elementClass: 'section'
});

const zoneAreas = sortObject(database.getZoneAreas());

for (const zone in zoneAreas) {
    new Element('H2', addressListSection, {
        elementClass: 'address-zone-header',
        text: zone
    });

    for (const areaName of zoneAreas[zone]) {
        const address = database.getAreaAddress(areaName);

        if (!address) {
            ipcRenderer.sendSync(
                'append-warning',
                `There is no address listed for ${areaName}.`
            );
            continue;
        }

        const table = new Element('TABLE', addressListSection, {
            elementClass: 'address-table'
        });

        const headerRow = new Element('TR', table, {
            elementClass: 'address-table-header-row'
        });

        new Element('TH', headerRow, {
            elementClass: 'address-table-header',
            text: areaName,
            attributes: {
                colspan: 2
            }
        });

        const topRow = new Element('TR', table, {
            elementClass: 'address-table-row'
        });

        const bottomRow = new Element('TR', table, {
            elementClass: 'address-table-row'
        });

        new Element('TD', topRow, {
            elementClass: 'address-table-row-postal',
            text: address.postalCode,
            attributes: {
                rowspan: 2
            }
        });

        new Element('TD', topRow, {
            elementClass: 'address-table-row-english',
            text: address.englishAddress
        });

        new Element('TD', bottomRow, {
            elementClass: 'address-table-row-japanese',
            text: address.japaneseAddress
        });
    }
}

contentElement.render();