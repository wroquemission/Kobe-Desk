const titlebarElement = document.querySelector('#titlebar');

class ViewNavigator {
    constructor() {
        this.categories = {};
        this.currentCategory = undefined;
        this.currentView = undefined;
    }

    selectCategory(category) {
        this.currentCategory = category;
        this.currentView = this.categories[category][0];

        this.currentView.render();

        if (this.currentView) {
            this.currentView.render();
        }
    }

    addView(category, view) {
        if (category in this.categories) {
            this.categories[category].push(view);
        } else {
            this.categories[category] = [view];
        }
    }

    renderViewList() {
        const listWrapper = new Element('DIV', null, {
            ID: 'view-list-wrapper'
        });

        for (const view of this.categories[this.currentCategory]) {
            let classes = ['view-list-item'];

            if (view.name === this.currentView.name) {
                classes.push('view-list-item-active');
            }

            new Element('DIV', listWrapper, {
                elementClass: classes,
                text: view.name
            });
        }

        return listWrapper;
    }

    renderTitlebar() {
        while (titlebarElement.firstChild) {
            titlebarElement.firstChild.remove();
        }

        const contentWrapper = new Element('DIV', titlebarElement, {
            ID: 'titlebar-content'
        });

        const selectWrapper = new Element('DIV', contentWrapper, {
            ID: 'category-select',
            eventListener: ['click', e => {
                e.preventDefault();
                e.stopPropagation();

                selectOptions.show();
            }]
        });

        const selectValue = new Element('DIV', selectWrapper, {
            ID: 'category-select-value',
            text: this.currentCategory
        });

        const selectArrow = new Element('SPAN', selectWrapper, {
            ID: 'category-select-arrow',
            text: 'arrow_drop_down',
            elementClass: 'icon'
        });

        const selectOptions = new Element('DIV', contentWrapper, {
            ID: 'category-select-options',
            hidden: true
        });

        document.addEventListener('click', e => {
            selectOptions.hide();
        }, false);

        for (const category in this.categories) {
            new Element('DIV', selectOptions, {
                elementClass: 'category-select-option',
                text: category,
                eventListener: ['click', () => {
                    selectOptions.hide();
                    this.selectCategory(category);
                    this.renderTitlebar();
                }]
            });
        }

        contentWrapper.addChild(
            this.renderViewList()
        );

        contentWrapper.render();
    }
}