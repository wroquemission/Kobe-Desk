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
    }

    addView(category, view) {
        if (category in this.categories) {
            this.categories[category].push(view);
        } else {
            this.categories[category] = [view];
        }
    }

    renderTitlebar() {
        const contentWrapper = new Element('DIV', titlebarElement, {
            ID: 'titlebar-content'
        });

        const selectWrapper = new Element('DIV', contentWrapper, {
            ID: 'category-select'
        });

        const selectValue = new Element('DIV', selectWrapper, {
            ID: 'category-select-value',
            text: this.currentCategory
        });

        const selectArrow = new Element('SPAN', selectValue, {
            ID: 'category-select-arrow',
            text: 'arrow_drop_down',
            elementClass: 'icon'
        });

        const selectOptions = new Element('DIV', selectWrapper, {
            ID: 'category-select-options',
            elementClass: 'hide'
        });

        for (const category in this.categories) {
            new Element('DIV', selectOptions, {
                elementClass: 'category-select-option',
                text: category
            });
        }

        contentWrapper.render();
    }
}