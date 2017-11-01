"use strict";
const {fork} = require('child_process');

const LocalRepoUtils = () => {
    const DEFAULT_BRANCH = 'MASTER';

    const cloneRepo = (repoUrl, owner) => {
        const cloneFork = fork('./clone-workers/workers/cloneWorker.js');

        cloneFork.on('message', (data) => {
            console.log('data: ', data);
        });

        cloneFork.send({repoUrl:repoUrl, owner:owner});
    };

    const updateRepo = (repoUrl) => {

    };

    const pullLatest = (repoUrl, branch) => {

    };

    const cloneRepos = (repos) => {
        let counter = 0;
        repos.forEach(repo => {
            console.log(JSON.stringify(repo));
            cloneRepo(repo.cloneUrl, repo.owner);
            counter++;
        });

        console.log(`${counter} processes forked to download git repositori`);
    };


    return {
        cloneRepos: cloneRepos,
        cloneRepo: cloneRepo,
        updateRepo: updateRepo,
        pullLatest: pullLatest
    }
};

module.exports = LocalRepoUtils;