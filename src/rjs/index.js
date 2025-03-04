const database = new Database();

const viewCategories = {
    'Import': [
        new ImportRosterView(database)
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

viewNavigator.selectCategory('Import');
viewNavigator.renderTitlebar();