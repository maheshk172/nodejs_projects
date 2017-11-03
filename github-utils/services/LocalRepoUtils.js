"use strict";
const {fork, spawn} = require('child_process');
const DatabaseService = require('../common/memory-db/DatabaseService');

const LocalRepoUtils = () => {
    const DEFAULT_BRANCH = 'MASTER';

    const cloneRepo = (repo) => {
        const cloneFork = fork(__dirname + '/workers/cloneWorker.js');

        cloneFork.on('message', (updatedRepo) => {
            if (updatedRepo) {
                DatabaseService.addRepo(updatedRepo);
            }
        });

        cloneFork.send(repo);
    };

    const pull = (repoName, branch) => {

        console.log('Fetching details for repo: ', repoName);
        let repo = DatabaseService.getRepoDetails(repoName);
        if (repo) {
            const pullLatestWorkerFork = fork(__dirname + '/workers/pullLatestWorker.js');

            pullLatestWorkerFork.on('message', (message) => {
                console.log(message);
            });

            pullLatestWorkerFork.send(repo);
        } else {
            console.log(`Repository ${repoName} has never cloned, clone it first and then try to pull`);
        }
    };

    const pullLatest = (reponame, branch) => {
        pull(reponame, branch);
    };

    const cloneRepos = (repos) => {
        let counter = 0;
        repos.forEach(repo => {
            console.log(JSON.stringify(repo));
            cloneRepo(repo);
            counter++;
        });

        console.log(`${counter} processes forked to download git repository`);
    };

    const getRepos = () => {
        let listOfRepos = DatabaseService.getRepos();
        let count = 1;
        listOfRepos.forEach((repo) => {
            console.log(`${count}. ${repo.name}     -   ${repo.localPath}   -         ${repo.cloneUrl}`);
            count++;
        });
    };

    const getRepoDetails = (repoName) => {
        let repo = DatabaseService.getRepoDetails(repoName);
        if (repo) {
            console.log(`\nRepo Name: ${repo.name}\nLocal Repo PAth: ${repo.localPath}\nRemote Clone URL: ${repo.cloneUrl} \nOwner: ${repo.owner}`);
        } else {
            console.log('Unable to locate the repo with name: ', repoName);
        }
    };


    return {
        cloneRepos: cloneRepos,
        cloneRepo: cloneRepo,
        pullLatest: pullLatest,
        getRepos: getRepos,
        getRepoDetails: getRepoDetails
    }
};

module.exports = LocalRepoUtils();