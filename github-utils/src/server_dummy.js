'use strict';

const RepositoryUtils = require('./repos/RepositoryUtils')();
const config = require('./configuration/config');
const LocalRepoUtils = require('./clone-workers/LocalRepoUtils')();

const fetchReposForUser = (userName) => {
    RepositoryUtils.getAllReposForUser(userName)
        .then(LocalRepoUtils.cloneRepos)
        .catch((error) => {
            console.error(error);
        });
};


//Fetch All repos
fetchReposForUser(config.USER_NAME);
