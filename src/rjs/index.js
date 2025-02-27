const viewCategories = {
    'Import': [
        new ImportRosterView()
    ],
    'Create': [
        new CreateTransferDocsView()
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