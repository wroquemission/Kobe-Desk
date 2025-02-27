const titlebarElement = document.querySelector('#titlebar');

class ViewNavigator {
    constructor(defaultCategory, defaultView) {
        this.categories = {};
        this.currentCategory = defaultCategory;
        this.currentView = defaultView;
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
        view.build();

        if (category in this.categories) {
            this.categories[category].push(view);
        } else {
            this.categories[category] = [view];
        }
    }

    renderViewList() {
        const listWrapper = new Element('DIV', null, {
            
        });

        return listWrapper;
    }

    renderTitlebar() {
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
                    selectValue.setText(category);
                }]
            });
        }

        contentWrapper.addChild(
            this.renderViewList()
        );

        contentWrapper.render();
    }
}