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