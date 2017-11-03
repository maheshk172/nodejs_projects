"use strict";

const SharedDataService = () => {

    let databaseService;
    this.setDatabaseService = (commonDatabaseService) => {
        databaseService = commonDatabaseService;
    };

    this.getDatabaseService = () => {
        return databaseService;
    };
};

module.exports = SharedDataService();