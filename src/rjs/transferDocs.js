const contentElement = document.querySelector('#content');

const database = new Database();
database.loadData();

const phoneHeader = new Element('H1', contentElement, {
    elementClass: 'docs-header',
    text: 'Phone Numbers'
});

new Element('H1', contentElement, {
    elementClass: 'section-title',
    text: 'Phone List'
});

const phoneListSection = new Element('DIV', contentElement, {
    elementClass: 'section'
});
