class EditPeopleView extends View {
    get name() { return 'People'; }

    constructor(database) {
        super(database, {
            page: 0,
            entriesPerPage: 10
        });
    }

    getEntries() {
        const profiles = this.database.getProfiles();

        const table = new Element('DIV', null, {
            elementClass: 'edit-view-table'
        });

        const people = Object.values(this.database.people);

        const start = this.page * this.entriesPerPage;
        const end = Math.min(people.length, (this.page + 1) * this.entriesPerPage);

        for (let i = start; i < end; i++) {
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

            i++;
        }
        
        return table;
    }

    render() {
        this.elements = [];

        const header = new Element('H1', null, {
            elementClass: 'view-header',
            text: 'People'
        });

        this.addElement(header);

        const table = this.getEntries();

        this.addElement(table);

        const pagination = new Element('DIV', null, {
            elementClass: 'edit-view-pagination'
        });

        const peopleCount = Object.keys(this.database.people).length;

        const leftButton = new Element('BUTTON', pagination, {
            elementClass: [
                'edit-view-pagination-left',
                this.page === 0 ? 'edit-view-pagination-inactive' : ''
            ],
            text: 'arrow_back',
            eventListener: ['click', () => {
                if (this.page > 0) {
                    this.page--;
                    table.replace(
                        this.getEntries()
                    );

                    this.resetScroll();
                }

                if (this.page === 0) {
                    leftButton.element.classList.add('edit-view-pagination-inactive');
                }

                if ((this.page + 1) * this.entriesPerPage < peopleCount) {
                    rightButton.element.classList.remove('edit-view-pagination-inactive');
                }
            }],
            attributes: {
                'tabindex': '-1'
            }
        });

        const rightButton = new Element('BUTTON', pagination, {
            elementClass: [
                'edit-view-pagination-right',
                (this.page + 1) * this.entriesPerPage >= peopleCount ? 'edit-view-pagination-inactive' : ''
            ],
            text: 'arrow_forward',
            eventListener: ['click', () => {
                if ((this.page + 1) * this.entriesPerPage < peopleCount) {
                    this.page++;
                    table.replace(
                        this.getEntries()
                    );

                    this.resetScroll();
                }

                if (this.page > 0) {
                    leftButton.element.classList.remove('edit-view-pagination-inactive');
                }

                if ((this.page + 1) * this.entriesPerPage >= peopleCount) {
                    rightButton.element.classList.add('edit-view-pagination-inactive');
                }
            }],
            attributes: {
                'tabindex': '-1'
            }
        });

        this.addElement(pagination);

        super.render();
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
                    const extension = path.extname(filePath[0]).slice(1);

                    let raw = fs.readFileSync(filePath[0]).toString('base64');

                    if (extension === 'png') {
                        raw = 'data:image/png;base64,' + raw;
                    } else if (extension === 'jpg' || extension === 'jpeg') {
                        raw = 'data:image/jpeg;base64,' + raw;
                    }

                    image.element.src = raw;

                    this.database.importProfile(filePath[0], person.ID);
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