class Element {
    constructor(tag, parent, parameters) {
        this.tag = tag;
        this.parent = parent;
        
        this.parameters = parameters;

        this.children = [];

        if (parent instanceof Element) {
            this.parent.addChild(this);
        }
    }

    addChild(child) {
        child.parent = this;
        this.children.push(child);
    }

    render() {
        const { elementClass, ID, text, eventListener, attributes } = this.parameters;

        const element = document.createElement(this.tag);

        if (elementClass) {
            if (Array.isArray(elementClass)) {
                elementClass.forEach(x => {
                    element.classList.add(x);
                });
            } else {
                element.classList.add(elementClass);
            }
        }

        if (ID) {
            element.setAttribute('id', ID);
        }

        if (eventListener) {
            const [trigger, callback] = eventListener;

            if (Array.isArray(trigger)) {
                trigger.forEach(type => {
                    element.addEventListener(type, callback, false);
                });
            } else {
                element.addEventListener(trigger, callback, false);
            }
        }

        if (text) {
            element.innerHTML = text;
        }

        if (attributes) {
            for (const attribute in attributes) {
                if (attributes[attribute]) {
                    element.setAttribute(attribute, attributes[attribute]);
                }
            }
        }

        for (const child of this.children) {
            element.appendChild(child.render());
        }


        if (!(this.parent instanceof Element)) {
            this.parent.appendChild(element);
        }

        return element;
    }
}