'use strict';

const RepositoryUtils = require('./services/RemoteRepoUtils')();
const config = require('./configuration/config');
const LocalRepoUtils = require('./services/LocalRepoUtils')();

const fetchReposForUser = (userName) => {
    RepositoryUtils.getAllReposForUser(userName)
        .then(LocalRepoUtils.cloneRepos)
        .catch((error) => {
            console.error(error);
        });
};


//Fetch All services
fetchReposForUser(config.USER_NAME);
