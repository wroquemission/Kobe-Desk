const viewCategories = {
    'Create': [
        new TransferDocsView()
    ]
};

const viewNavigator = new ViewNavigator('Create', viewCategories['Create'][0]);

for (const category in viewCategories) {
    for (const view of viewCategories[category]) {
        viewNavigator.addView(category, view);
    }
}

viewNavigator.renderTitlebar();