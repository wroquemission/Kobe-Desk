const viewContainer = document.querySelector('#view');

viewContainer.onload = () => {
    viewContainer.scrollTo(0, 0);
    window.scrollTo(0, 0);
};

class View {
    get name() { return undefined; }

    constructor(database, properties) {
        this.database = database;
        this.elements = [];

        this.navigator = undefined;

        if (properties) {
            for (const property in properties) {
                this[property] = properties[property];
            }
        }

        this.build();
    }

    resetScroll() {
        window.scrollTo(0, 0);
        viewContainer.scrollTo(0, 0);
    }

    addElement(element) {
        this.elements.push(element);
    }

    build() {}

    render() {
        while (viewContainer.firstChild) {
            viewContainer.firstChild.remove();
        }

        for (const element of this.elements) {
            viewContainer.appendChild(
                element.render()
            );
        }

        this.resetScroll();
    }
}

class DetailsView extends View {
    get name() { return undefined; }

    constructor(database, navigator, parentView, title, properties) {
        super(database, properties);

        this.parentView = parentView;
        this.navigator = navigator;
        this.title = title;
    }

    render() {
        super.render();

        this.navigator.renderDetailsBar(
            this.parentView,
            this.title
        );
    }
}

class PaginatedView extends View {
    constructor(database) {
        super(database, {
            page: 0,
            entriesPerPage: 10
        });
    }

    getCount() {}

    getEntries() {}

    render() {
        this.elements = [];

        const header = new Element('H1', null, {
            elementClass: 'view-header',
            text: this.name
        });

        this.addElement(header);

        const table = this.getEntries(
            this.page * this.entriesPerPage,
            Math.min(this.getCount(), (this.page + 1) * this.entriesPerPage)
        );

        this.addElement(table);

        const pagination = new Element('DIV', null, {
            elementClass: 'edit-view-pagination'
        });

        const count = this.getCount();

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
                        this.getEntries(
                            this.page * this.entriesPerPage,
                            Math.min(this.getCount(), (this.page + 1) * this.entriesPerPage)
                        )
                    );

                    this.resetScroll();
                }

                if (this.page === 0) {
                    leftButton.element.classList.add('edit-view-pagination-inactive');
                }

                if ((this.page + 1) * this.entriesPerPage < count) {
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
                (this.page + 1) * this.entriesPerPage >= count ? 'edit-view-pagination-inactive' : ''
            ],
            text: 'arrow_forward',
            eventListener: ['click', () => {
                if ((this.page + 1) * this.entriesPerPage < count) {
                    this.page++;
                    table.replace(
                        this.getEntries(
                            this.page * this.entriesPerPage,
                            Math.min(this.getCount(), (this.page + 1) * this.entriesPerPage)
                        )
                    );

                    this.resetScroll();
                }

                if (this.page > 0) {
                    leftButton.element.classList.remove('edit-view-pagination-inactive');
                }

                if ((this.page + 1) * this.entriesPerPage >= count) {
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
