const { ipcRenderer } = require("electron");

const contentElement = document.querySelector('#content');


ipcRenderer.addListener('render-transfer-docs', () => {
    const database = new Database();
    database.loadData();

    const phoneHeader = new Element('H1', contentElement, {
        elementClass: 'docs-header',
        text: 'Phone Numbers'
    });

    const zones = database.getZoneAreas();

    for (const zoneName in zones) {
        const zone = zones[zoneName];

        for (const area of zone) {
            const number = database.getAreaNumber(area);

            console.log(zone, area, number);
        }
    }
});