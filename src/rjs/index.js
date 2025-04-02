const database = new Database();
database.loadData();

const viewCategories = {
    'Import': [
        new ImportRosterView(database),
        new ImportAddressesView(database),
        new ImportAddressKeyView(database),
        new ImportProfilesView(database)
    ],
    'Create': [
        new CreateTransferDocsView(database)
    ]
};

const viewNavigator = new ViewNavigator();

for (const category in viewCategories) {
    for (const view of viewCategories[category]) {
        viewNavigator.addView(category, view);
    }
}

viewNavigator.selectCategory('Create');
viewNavigator.renderTitlebar();