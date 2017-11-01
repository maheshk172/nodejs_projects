"use strict";

const {_} = require('lodash');
const AdvancedRequest = require('../common/AdvancedRequest');
const config = require('../configuration/config');

const RemoteRepoUtils = () => {

    const getOrganizations = (userName) => {
        return AdvancedRequest.get(`${config.GIT_API_BASE_PATH}/user/orgs`);
    };

    const getPersonalReposForUser = (userName) => {
        return AdvancedRequest.get(`${config.GIT_API_BASE_PATH}/users/${userName}/repos`);
    };


    const getReposForOrganization = (organizationName) => {
        return AdvancedRequest.get(`${config.GIT_API_BASE_PATH}/orgs/${organizationName}/repos`);
    };


    const getAllReposForUser = (userName) => {
        return new Promise((Resolve, Reject) => {
            const promise1 = new Promise((promise1Resolve, promise1Reject) => {
                getOrganizations(userName)
                    .then(organizations => {

                        let promises = [];

                        organizations.forEach(organization => {
                            //ToDo read Logic and update services
                            promises.push(new Promise((promise11Resolve, promise11Reject) => {
                                getReposForOrganization(organization.login).then(repos => {
                                    let tempRepos = [];
                                    repos.forEach(repo => {
                                        if (!repo.fork && config.EXCLUDE_REPOS.indexOf(repo.name) == -1) {
                                            tempRepos.push({
                                                name: repo.name,
                                                owner: organization.login,
                                                cloneUrl: repo.clone_url
                                            });
                                        }
                                    });
                                    promise11Resolve(tempRepos);
                                }).catch(error => {
                                    //console.error(error);
                                    promise11Reject(error);
                                });
                            }));
                        });

                        Promise.all(promises)
                            .then(tempRepos => {
                                let allRepositories = [];
                                tempRepos.forEach(repo => {
                                    allRepositories = allRepositories.concat(repo);
                                });
                                promise1Resolve(allRepositories);
                            })
                            .catch(error => {
                                promise1Reject(error);
                            });
                    })
                    .catch(error => {
                        promise1Reject(error);
                    });
            });


            const promise2 = new Promise((promise2Resolve, promise2Reject) => {
                getPersonalReposForUser(userName)
                    .then(repos => {
                        let tempRepos = [];
                        repos.forEach(repo => {
                            if (!repo.fork && config.EXCLUDE_REPOS.indexOf(repo.name) == -1 ) {
                                tempRepos.push({
                                    name: repo.name,
                                    owner: userName,
                                    cloneUrl: repo.clone_url
                                });
                            }
                        });

                        promise2Resolve(tempRepos);
                    })
                    .catch(error => {
                        //console.error(error);
                        promise2Reject(error);
                    });
            });
            let allRepositories = [];
            Promise.all([promise1, promise2])
                .then(tempRepos => {
                    tempRepos.forEach(repo => {
                        allRepositories = allRepositories.concat(repo);
                    });
                    Resolve(allRepositories);
                })
                .catch(error => {
                    Reject(error);
                });


        });
    };


    return {
        getOrganizations: getOrganizations,
        getPersonalReposForUser: getPersonalReposForUser,
        getReposForOrganization: getReposForOrganization,
        getAllReposForUser: getAllReposForUser
    }
};


module.exports = RemoteRepoUtils();