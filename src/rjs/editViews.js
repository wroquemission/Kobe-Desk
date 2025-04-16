class EditPeopleView extends PaginatedView {
    get name() { return 'People'; }

    getCount() {
        if (this.count) {
            return this.count;
        }

        return Object.keys(this.database.people).length;
    }

    render() {
        super.render();
        
        const controlsWrapper = new Element('DIV', null, {
            elementClass: 'edit-details-controls-wrapper'
        });

        const searchInput = new Element('INPUT', controlsWrapper, {
            elementClass: 'edit-details-search-input',
            attributes: {
                placeholder: 'Search...',
                spellcheck: 'false'
            },
            eventListener: ['keyup', () => {
                this.refreshTable(searchInput.element.value);
            }]
        });

        this.elements[0].element.after(
            controlsWrapper.render()
        );
    }

    getEntries(start, end, query) {
        const profiles = this.database.getProfiles();
        
        const controlsWrapper = new Element('DIV', null, {
            elementClass: 'edit-details-controls-wrapper'
        });

        const searchInput = new Element('INPUT', controlsWrapper, {
            elementClass: 'edit-details-search-input',
            attributes: {
                placeholder: 'Search...'
            },
            eventListener: ['keyup', () => {
                this.refreshTable(searchInput.element.value);
            }]
        });

        const table = new Element('DIV', null, {
            elementClass: 'edit-view-table'
        });

        query = query ? query.toLowerCase() : '';

        const people = Object.values(this.database.people).filter(person => {
            const area = this.database.getPersonArea(person.name);

            if (area) {
                return person.name.toLowerCase().includes(query)
                    || person.ID.toLowerCase().includes(query)
                    || person.type.toLowerCase().includes(query)
                    || person.assignment.toLowerCase().includes(query)
                    || person.status.toLowerCase().includes(query)
                    || area.name.toLowerCase().includes(query)
                    || area.district.toLowerCase().includes(query)
                    || area.zone.toLowerCase().includes(query);
            }

            return person.name.toLowerCase().includes(query)
                || person.ID.toLowerCase().includes(query)
                || person.type.toLowerCase().includes(query)
                || person.assignment.toLowerCase().includes(query)
                || person.status.toLowerCase().includes(query);
        });

        this.count = people.length;

        for (let i = start; i < Math.min(end, people.length); i++) {
            const person = people[i];

            const isInField = person.status === 'In-Field';

            const row = new Element('DIV', table, {
                elementClass: ['edit-view-row', isInField ? 'edit-view-in-field' : 'edit-view-not-in-field'],
                eventListener: ['click', () => {
                    const view = new EditPeopleDetailsView(
                        this.database,
                        this.navigator,
                        this,
                        person.name,
                        {
                            person: person,
                            profile: profiles[person.ID]
                        }
                    );

                    view.render();
                }]
            });

            new Element('DIV', row, {
                elementClass: 'edit-view-person-name',
                text: person.type + ' ' + person.name.split(',')[0]
            });

            if (!isInField) continue;

            new Element('DIV', row, {
                elementClass: 'edit-view-person-assignment',
                text: person.assignment
            });

            const area = this.database.getPersonArea(person.name);

            new Element('DIV', row, {
                elementClass: 'edit-view-person-area',
                text: area.name
            });

            new Element('DIV', row, {
                elementClass: 'edit-view-person-district',
                text: area.district
            });

            new Element('DIV', row, {
                elementClass: 'edit-view-person-zone',
                text: area.zone
            });

            const profileWrapper = new Element('DIV', row, {
                elementClass: 'edit-view-profile-wrapper'
            });

            if (person.ID in profiles) {
                const imageWrapper = new Element('DIV', profileWrapper, {
                    elementClass: 'edit-view-profile-image-wrapper'
                });

                new Element('IMG', imageWrapper, {
                    elementClass: 'edit-view-profile',
                    attributes: {
                        src: profiles[person.ID]
                    }
                });
            }

            new Element('DIV', profileWrapper, {
                elementClass: 'edit-view-person-ID',
                text: person.ID
            });
        }
        
        return table;
    }
}

class EditPeopleDetailsView extends DetailsView {
    build() {
        const person = this.person;

        const header = new Element('H1', null, {
            elementClass: 'view-header',
            text: person.type + ' ' + person.name
        });

        this.addElement(header);

        const imageWrapper = new Element('DIV', null, {
            elementClass: 'edit-details-profile-image-wrapper'
        });

        const image = new Element('IMG', imageWrapper, {
            elementClass: 'edit-details-profile',
            attributes: {
                src: this.profile
            }
        });

        new Element('BUTTON', imageWrapper, {
            elementClass: 'edit-details-profile-button',
            text: 'Upload',
            eventListener: ['click', () => {
                const filePath = dialog.showOpenDialogSync({
                    properties: ['openFile'],
                    filters: [
                        { name: 'Image', extensions: ['jpg', 'jpeg' ] }
                    ]
                });

                if (filePath) {
                    const raw = this.database.importProfile(filePath[0], person.ID);

                    image.element.src = raw;
                }
            }]
        });

        this.addElement(imageWrapper);

        const table = new Element('TABLE', null, {
            elementClass: 'edit-details-table'
        });

        const fields = [
            ['ID', 'ID', 'text'],
            ['Type', 'type', 'text'],
            ['Assignment', 'assignment', 'text'],
            ['Status', 'status', 'text'],
            ['Arrival Date', 'arrivalDate', 'date'],
            ['Release Date', 'releaseDate', 'date']
        ];

        for (const field of fields) {
            const [ title, identifier, type ] = field;

            const row = new Element('TR', table, {
                elementClass: 'edit-details-table-row'
            });

            new Element('TD', row, {
                elementClass: 'edit-details-table-header',
                text: title
            });

            const valueColumn = new Element('TD', row, {
                elementClass: 'edit-details-table-value-column',
            });

            const value = person[identifier];

            const input = new Element('INPUT', valueColumn, {
                elementClass: 'edit-details-table-value-input',
                attributes: {
                    value: type === 'date' ? (new Date(value)).toISOString().split('T')[0] : value,
                    type: type
                },
                eventListener: ['change', () => {
                    person[identifier] = input.element.value;
                    this.database.saveData();
                }]
            });
        }

        this.addElement(table);
    }
}

class EditAddressesView extends PaginatedView {
    get name() { return 'Addresses'; }

    getCount() {
        if (this.count) {
            return this.count;
        }

        return Object.keys(this.database.addresses).length;
    }

    getEntries(start, end, query) {
        const table = new Element('DIV', null, {
            elementClass: 'edit-view-table'
        });

        query = query ? query.toLowerCase() : '';

        const addresses = Object.values(this.database.addresses).filter(address => {
            return address.name.toLowerCase().includes(query)
                || address.postalCode.includes(query)
                || address.englishAddress.includes(query)
                || address.japaneseAddress.includes(query);
        });

        this.count = addresses.length;

        for (let i = start; i < Math.min(end, addresses.length); i++) {
            const address = addresses[i];

            const row = new Element('DIV', table, {
                elementClass: 'edit-view-address-row',
                eventListener: ['click', () => {
                    const view = new EditAddressesDetailsView(
                        this.database,
                        this.navigator,
                        this,
                        address.name,
                        { address }
                    );

                    view.render();
                }]
            });

            const upperWrapper = new Element('DIV', row, {
                elementClass: 'edit-view-address-upper-wrapper'
            });

            new Element('DIV', upperWrapper, {
                elementClass: 'edit-view-address-postal-code',
                text: address.postalCode
            });

            const addressWrapper = new Element('DIV', upperWrapper, {
                elementClass: 'edit-view-address-wrapper'
            });

            new Element('DIV', addressWrapper, {
                elementClass: 'edit-view-address-english',
                text: address.englishAddress
            });

            new Element('DIV', addressWrapper, {
                elementClass: 'edit-view-address-japanese',
                text: address.japaneseAddress
            });

            const areasWrapper = new Element('DIV', row, {
                elementClass: 'edit-view-address-areas-wrapper'
            });

            for (const area of address.areas) {
                new Element('DIV', areasWrapper, {
                    elementClass: 'edit-view-address-area',
                    text: area
                });
            }
        }
        
        return table;
    }

    render() {
        super.render();
        
        const controlsWrapper = new Element('DIV', null, {
            elementClass: 'edit-details-controls-wrapper'
        });

        const searchInput = new Element('INPUT', controlsWrapper, {
            elementClass: 'edit-details-search-input',
            attributes: {
                placeholder: 'Search...',
                spellcheck: 'false'
            },
            eventListener: ['keyup', () => {
                this.refreshTable(searchInput.element.value);
            }]
        });

        new Element('BUTTON', controlsWrapper, {
            elementClass: 'edit-details-add-button',
            text: 'add',
            eventListener: ['click', () => {
                const view = new EditAddressesAddView(
                    this.database,
                    this.navigator,
                    this,
                    'Add Address'
                );

                view.render();
            }]
        });

        this.elements[0].element.after(
            controlsWrapper.render()
        );
    }
}

class EditAddressesDetailsView extends DetailsView {
    build() {
        const address = this.address;

        const header = new Element('H1', null, {
            elementClass: 'view-header',
            text: address.name
        });

        this.addElement(header);

        const table = new Element('TABLE', null, {
            elementClass: 'edit-details-table'
        });

        const fields = [
            ['Postal Code', 'postalCode', 'text'],
            ['English Address', 'englishAddress', 'text'],
            ['Japanese Address', 'japaneseAddress', 'text'],
        ];

        for (const field of fields) {
            const [ title, identifier, type ] = field;

            const row = new Element('TR', table, {
                elementClass: 'edit-details-table-row'
            });

            new Element('TD', row, {
                elementClass: 'edit-details-table-header',
                text: title
            });

            const valueColumn = new Element('TD', row, {
                elementClass: 'edit-details-table-value-column',
            });

            const value = address[identifier];

            const input = new Element('INPUT', valueColumn, {
                elementClass: 'edit-details-table-value-input',
                attributes: {
                    value: type === 'date' ? (new Date(value)).toISOString().split('T')[0] : value,
                    type: type
                },
                eventListener: ['change', () => {
                    address[identifier] = input.element.value;
                    this.database.saveData();
                }]
            });
        }

        this.addElement(table);

        let areas = [];

        const areasWrapper = new Element('DIV', null, {
            elementClass: 'edit-add-areas-wrapper'
        });

        const areasList = new Element('DIV', areasWrapper, {
            elementClass: 'edit-add-areas-list'
        });

        const areasSelectWrapper = new Element('DIV', areasWrapper, {
            elementClass: 'edit-add-areas-select-wrapper'
        });

        const areasSelect = new Element('SELECT', areasSelectWrapper, {
            elementClass: 'edit-add-areas-select'
        });

        new Element('OPTION', areasSelect, {
            text: ''
        });

        for (const areaName in this.database.areas) {
            new Element('OPTION', areasSelect, {
                text: areaName
            });
        }

        for (const area of address.areas) {
            areas.push(area);

            const areaListElement = new Element('DIV', areasList, {
                elementClass: 'edit-add-areas-list-element'
            });

            new Element('DIV', areaListElement, {
                elementClass: 'edit-add-areas-list-area',
                text: area
            });

            new Element('BUTTON', areaListElement, {
                elementClass: 'edit-add-areas-list-delete',
                text: 'close',
                eventListener: ['click', () => {
                    areaListElement.element.remove();
                    areas = areas.filter(x => x !== area);
                    address.areas = areas;

                    this.database.saveData();
                }]
            });
        }

        new Element('BUTTON', areasSelectWrapper, {
            elementClass: 'edit-add-areas-select-button',
            text: 'add',
            eventListener: ['click', () => {
                const value = areasSelect.element.value;

                if (value && areas.indexOf(value) === -1) {
                    areas.push(value);

                    address.areas = areas;
                    this.database.saveData();

                    const areaListElement = new Element('DIV', null, {
                        elementClass: 'edit-add-areas-list-element'
                    });

                    new Element('DIV', areaListElement, {
                        elementClass: 'edit-add-areas-list-area',
                        text: value
                    });

                    new Element('BUTTON', areaListElement, {
                        elementClass: 'edit-add-areas-list-delete',
                        text: 'close',
                        eventListener: ['click', () => {
                            areaListElement.element.remove();
                            areas = areas.filter(x => x !== value);
                            address.areas = areas;

                            this.database.saveData();
                        }]
                    });

                    areasList.element.appendChild(
                        areaListElement.render()
                    );

                    areasSelect.element.value = '';
                }
            }]
        });

        this.addElement(areasWrapper);

        const deleteButton = new Element('BUTTON', null, {
            elementClass: 'edit-view-delete-button',
            text: 'DELETE',
            eventListener: ['click', () => {
                delete this.database.addresses[this.address.name];
                this.database.saveData();

                this.navigateBack();
            }]
        });

        this.addElement(deleteButton);
    }
}

class EditAddressesAddView extends DetailsView {
    build() {
        const header = new Element('H1', null, {
            elementClass: 'view-header',
            text: 'Add Address'
        });

        this.addElement(header);

        const table = new Element('TABLE', null, {
            elementClass: 'edit-details-table'
        });

        const fields = [
            ['Name', 'name'],
            ['Postal Code', 'postalCode'],
            ['English Address', 'englishAddress'],
            ['Japanese Address', 'japaneseAddress'],
        ];

        let inputValues = {};

        for (const field of fields) {
            const [title, identifier] = field;

            inputValues[identifier] = '';

            const row = new Element('TR', table, {
                elementClass: 'edit-details-table-row'
            });

            new Element('TD', row, {
                elementClass: 'edit-details-table-header',
                text: title
            });

            const valueColumn = new Element('TD', row, {
                elementClass: 'edit-details-table-value-column',
            });

            const input = new Element('INPUT', valueColumn, {
                elementClass: 'edit-details-table-value-input',
                attributes: {
                    type: 'text'
                },
                eventListener: ['change', () => {
                    inputValues[identifier] = input.element.value;
                }]
            });
        }

        this.addElement(table);

        let areas = [];

        const areasWrapper = new Element('DIV', null, {
            elementClass: 'edit-add-areas-wrapper'
        });

        const areasList = new Element('DIV', areasWrapper, {
            elementClass: 'edit-add-areas-list'
        });

        const areasSelectWrapper = new Element('DIV', areasWrapper, {
            elementClass: 'edit-add-areas-select-wrapper'
        });

        const areasSelect = new Element('SELECT', areasSelectWrapper, {
            elementClass: 'edit-add-areas-select'
        });

        new Element('OPTION', areasSelect, {
            text: ''
        });

        for (const areaName in this.database.areas) {
            new Element('OPTION', areasSelect, {
                text: areaName
            });
        }

        new Element('BUTTON', areasSelectWrapper, {
            elementClass: 'edit-add-areas-select-button',
            text: 'add',
            eventListener: ['click', () => {
                const value = areasSelect.element.value;

                if (value && areas.indexOf(value) === -1) {
                    areas.push(value);

                    const areaListElement = new Element('DIV', null, {
                        elementClass: 'edit-add-areas-list-element'
                    });

                    new Element('DIV', areaListElement, {
                        elementClass: 'edit-add-areas-list-area',
                        text: value
                    });

                    new Element('BUTTON', areaListElement, {
                        elementClass: 'edit-add-areas-list-delete',
                        text: 'close',
                        eventListener: ['click', () => {
                            areaListElement.element.remove();
                            areas = areas.filter(x => x !== value);
                        }]
                    });

                    areasList.element.appendChild(
                        areaListElement.render()
                    );

                    areasSelect.element.value = '';
                }
            }]
        });

        this.addElement(areasWrapper);

        const submitButton = new Element('BUTTON', null, {
            elementClass: 'edit-add-submit-button',
            text: 'Add',
            eventListener: ['click', () => {
                if (Object.values(inputValues).every(x => x)) {
                    const address = new Address(
                        inputValues.name,
                        inputValues.postalCode,
                        inputValues.englishAddress,
                        inputValues.japaneseAddress,
                        areas
                    );

                    this.database.addAddress(address);
                    this.database.saveData();

                    this.navigateBack();
                }
            }]
        });

        this.addElement(submitButton);
    }
}