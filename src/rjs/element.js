class Element {
    constructor(tag, parent, parameters) {
        this.tag = tag;
        this.parent = parent;
        
        this.parameters = parameters;

        if ('elementClass' in this.parameters) {
            if (!Array.isArray(this.parameters.elementClass)) {
                this.parameters.elementClass = [this.parameters.elementClass];
            }
        } else {
            this.parameters.elementClass = [];
        }

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

    addClass(elementClass) {
        this.parameters.elementClass.push(elementClass);
        
        if (this.element) {
            this.element.classList.add(elementClass);
        }
    }

    removeClass(elementClass) {
        const index = this.parameters.elementClass.indexOf(elementClass);

        if (index > -1) {
            this.parameters.elementClass.splice(index, 1);
        }
        
        if (this.element) {
            this.element.classList.remove(elementClass);
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

        elementClass.forEach(x => {
            if (x) {
                element.classList.add(x);
            }
        });

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
            element.innerHTML = text.replaceAll(/=(.*?)=/g, '<span class="text-highlight">$1</span>');
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


        if (!(this.parent instanceof Element) && this.parent) {
            this.parent.appendChild(element);
        }

        this.element = element;

        return element;
    }

    replace(element) {
        this.children = [];

        for (const child of element.children) {
            this.addChild(child);
        }

        this.tag = element.tag;
        this.parameters = element.parameters;

        element.parent = null;

        if (this.element) {
            const parentNode = this.element.parentNode;
            const newNode = element.render();

            parentNode.insertBefore(newNode, this.element);
            this.element.remove();

            this.element = newNode;
        }
    }
}