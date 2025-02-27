const viewContainer = document.querySelector('#view');

class View {
    static get name() { return undefined; }

    constructor() {
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