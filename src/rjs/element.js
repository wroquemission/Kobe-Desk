class Element {
    constructor(tag, parent, parameters) {
        this.tag = tag;
        this.parent = parent;
        
        this.parameters = parameters;

        this.children = [];

        if (parent instanceof Element) {
            this.parent.addChild(this);
        }

        this.element = undefined;
    }

    addChild(child) {
        child.parent = this;
        this.children.push(child);
    }

    hide() {
        if (this.element) {
            this.element.classList.add('hide');
        }
    }

    show() {
        if (this.element) {
            this.element.classList.remove('hide');
        }
    }

    setText(text) {
        if (this.element) {
            this.element.innerText = text;
        }
    }

    render() {
        const { elementClass, ID, hidden, text, eventListener, attributes } = this.parameters;
 
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

        if (hidden) {
            element.classList.add('hide');
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

        this.element = element;

        return element;
    }
}