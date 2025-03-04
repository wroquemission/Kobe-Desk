const viewContainer = document.querySelector('#view');

class View {
    get name() { return undefined; }

    constructor(database) {
        this.database = database;
        this.elements = [];
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