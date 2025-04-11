const viewContainer = document.querySelector('#view');

class View {
    get name() { return undefined; }

    constructor(database, properties) {
        this.database = database;
        this.elements = [];

        if (properties) {
            for (const property in properties) {
                this[property] = properties[property];
            }
        }

        this.build();
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
    }
}