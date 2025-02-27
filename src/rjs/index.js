const viewCategories = {
    'Import': [
        new ImportRosterView()
    ],
    'Create': [
        new CreateTransferDocsView()
    ]
};

const viewNavigator = new ViewNavigator('Create', viewCategories['Create'][0]);

for (const category in viewCategories) {
    for (const view of viewCategories[category]) {
        viewNavigator.addView(category, view);
    }
}

viewNavigator.renderTitlebar();
viewNavigator.selectCategory('Create');