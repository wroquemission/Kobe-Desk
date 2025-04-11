class EditPeopleView extends View {
    get name() { return 'People'; }

    constructor(database) {
        super(database, {
            page: 0,
            entriesPerPage: 10
        });
    }

    getEntries(start, end) {
        const profiles = this.database.getProfiles();

        const table = new Element('DIV', null, {
            elementClass: 'edit-view-table'
        });

        let i = 0;

        for (const person of Object.values(this.database.people)) {
            if (i >= this.entriesPerPage) {
                break;
            }

            const isInField = person.status === 'In-Field';

            const row = new Element('DIV', table, {
                elementClass: ['edit-view-row', isInField ? 'edit-view-in-field' : 'edit-view-not-in-field']
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

        const table = this.getEntries(0, this.entriesPerPage);

        this.addElement(table);

        const pagination = new Element('DIV', null, {
            elementClass: 'edit-view-pagination'
        });

        new Element('BUTTON', pagination, {
            elementClass: 'edit-view-pagination-left',
            text: 'arrow_back'
        });

        new Element('BUTTON', pagination, {
            elementClass: 'edit-view-pagination-right',
            text: 'arrow_forward'
        });

        this.addElement(pagination);

        super.render();
    }
}