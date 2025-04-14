const database = new Database();
database.loadData();

const viewCategories = {
    'Import': [
        new ImportRosterView(database),
        new ImportAddressesView(database),
        new ImportAddressKeyView(database),
        new ImportProfilesView(database),
        new ImportCoversView(database)
    ],
    'Create': [
        new CreateTransferDocsView(database)
    ],
    'Edit': [
        new EditPeopleView(database),
        new EditAddressesView(database)
    ]
};

const viewNavigator = new ViewNavigator();

for (const category in viewCategories) {
    for (const view of viewCategories[category]) {
        viewNavigator.addView(category, view);
    }
}

viewNavigator.selectCategory('Edit');
viewNavigator.renderTitlebar();