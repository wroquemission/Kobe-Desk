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

    navigateBack() {
        this.navigator.renderTitlebar();
        this.parentView.render();
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
            entriesPerPage: 25,
            query: '',
            count: undefined
        });

        this.table = undefined;
        this.leftButton = undefined;
        this.rightButton = undefined;
    }

    getCount() {}

    getEntries() {}

    refreshTable(query) {
        if (query && query !== this.query) {
            this.page = 0;
        }

        if (query !== undefined) {
            this.query = query;
        }

        if (this.table) {
            this.table.replace(
                this.getEntries(
                    this.page * this.entriesPerPage,
                    Math.min(this.getCount(), (this.page + 1) * this.entriesPerPage),
                    this.query
                )
            );
        }

        if (this.leftButton) {
            if (this.page === 0) {
                this.leftButton.element.classList.add('edit-view-pagination-inactive');
            } else {
                this.leftButton.element.classList.remove('edit-view-pagination-inactive');
            }
        }

        if (this.rightButton) {
            if ((this.page + 1) * this.entriesPerPage < this.getCount()) {
                this.rightButton.element.classList.remove('edit-view-pagination-inactive');
            } else {
                this.rightButton.element.classList.add('edit-view-pagination-inactive');
            }
        }
    }

    render() {
        this.elements = [];

        const header = new Element('H1', null, {
            elementClass: 'view-header',
            text: this.name
        });

        this.addElement(header);

        this.table = this.getEntries(
            this.page * this.entriesPerPage,
            Math.min(this.getCount(), (this.page + 1) * this.entriesPerPage)
        );

        this.addElement(this.table);

        const pagination = new Element('DIV', null, {
            elementClass: 'edit-view-pagination'
        });

        const count = this.getCount();

        this.leftButton = new Element('BUTTON', pagination, {
            elementClass: [
                'edit-view-pagination-left',
                this.page === 0 ? 'edit-view-pagination-inactive' : ''
            ],
            text: 'arrow_back',
            eventListener: ['click', () => {
                if (this.page > 0) {
                    this.page--;
                    this.refreshTable();

                    this.resetScroll();
                }

                if (this.page === 0) {
                    this.leftButton.element.classList.add('edit-view-pagination-inactive');
                }

                if ((this.page + 1) * this.entriesPerPage < count) {
                    this.rightButton.element.classList.remove('edit-view-pagination-inactive');
                }
            }],
            attributes: {
                'tabindex': '-1'
            }
        });

        this.rightButton = new Element('BUTTON', pagination, {
            elementClass: [
                'edit-view-pagination-right',
                (this.page + 1) * this.entriesPerPage >= count ? 'edit-view-pagination-inactive' : ''
            ],
            text: 'arrow_forward',
            eventListener: ['click', () => {
                if ((this.page + 1) * this.entriesPerPage < count) {
                    this.page++;
                    this.refreshTable();

                    this.resetScroll();
                }

                if (this.page > 0) {
                    this.leftButton.element.classList.remove('edit-view-pagination-inactive');
                }

                if ((this.page + 1) * this.entriesPerPage >= count) {
                    this.rightButton.element.classList.add('edit-view-pagination-inactive');
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
