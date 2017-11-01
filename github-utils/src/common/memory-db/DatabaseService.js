"use strict";

const DatabaseUtils = require('./DatabaseUtils');

const DatabaseService = () => {

    const getRepos = () => {
        return DatabaseUtils.getRepos();
    };

    const getRepoDetails = (reponame) => {
        return DatabaseUtils.getRepoDetails(reponame);
    };

    const addRepo = (newRepo) => {
        DatabaseUtils.addRepo(newRepo);
    };

    return {
        getRepos: getRepos,
        getRepoDetails: getRepoDetails,
        addRepo: addRepo
    };
};

module.exports = DatabaseService();