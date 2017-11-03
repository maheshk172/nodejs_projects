#!/usr/bin/env node
'use strict';
const Config = require(__dirname + '/configuration/Configuration');
const RemoteRepoUtils = require('./services/RemoteRepoUtils');
const DatabaseUtils = require('./common/memory-db/DatabaseUtils');
const LocalRepoUtils = require('./services/LocalRepoUtils');


function printCommandHelp() {

    console.log('**** Usage: ****');
    console.log('--help                                   Print this help');
    console.log('--clone-all                              Search for your userid and clone all personal services and services from orgs where you contribute');
    console.log('--show-all                               Show all services cloned previously');
    console.log('--show-details {repo-name}               Show details for repository');
    console.log('--clone {repo-url}                       Clone a new repository and add on utility');
    console.log('--pull-latest {repo-name}                Pull latest for repository from remote');
    console.log('--clean-db                               Pull latest for repository from remote');
    console.log('--init                                   Create Default .gitutils-rc file');
    console.log('');
}

function printConfigHelp() {
    console.log('**** Configurations: ****');
    console.log('You need to create configuration file in your Home directory with name \'.gitutils-rc\' ');
    console.log('');
    console.log('** Sample .gitutils-rc ** ');
    console.log('');
    console.log('USER_NAME=<Your GITHUB  USERNAME>');
    console.log('GITHUB_TOKEN=<YOUR GITHUB TOKEN>');
    console.log('GIT_API_BASE_PATH=https://api.github.com');
    console.log('GIT_BASE_PATH=https://github.com');
    console.log('LOCAL_REPO_BASE_PATH=/projects_1/github');
    console.log('EXCLUDE_REPOS=');
    console.log('');
    console.log('You can use hash(#) for commenting lines in your config file');
    console.log('Also Note that, application can not work without .gitutils-rc file');
}


function printHelp() {
    console.log('');
    console.log('github-utils Help (C) Mahesh Kulkarni 2017');
    console.log('');
    printCommandHelp();
    printConfigHelp();

}

var args = process.argv.slice(2);

if (args[0] === '--help' || args.length === 0) {
    printHelp();
    process.exit(1);
}

let command = args[0].substr(2, args[0].length - 1);
if (command === 'init') {
    Config.createDefaultConfigFile();
}


Config.init().then((newConfig) => {
    Config.config = newConfig;
    DatabaseUtils.init()
        .then(() => {
            // args[0] -> command
            // args[1] -> first Param
            // args[2] -> second param
            switch (command) {
                case 'clone-all':
                    RemoteRepoUtils.getAllReposForUser(Config.config.USER_NAME)
                        .then(LocalRepoUtils.cloneRepos)
                        .catch((error) => {
                            console.error(error);
                        });
                    break;
                case 'show-all':
                    LocalRepoUtils.getRepos();
                    break;
                case 'show-details':
                    if (args[1]) {
                        LocalRepoUtils.getRepoDetails(args[1]);
                    } else {
                        printHelp();
                    }
                    break;
                case 'clone-repo':
                    if (args[1]) {
                        LocalRepoUtils.cloneRepo(args[1]);
                    } else {
                        printHelp();
                    }
                    break;
                case 'pull-latest':
                    if (args[1]) {
                        LocalRepoUtils.pullLatest(args[1]);
                    } else {
                        printHelp();
                    }
                    break;
                case 'clean-db':
                    DatabaseUtils.cleanDB();
                    break;
                case 'init':
                    break;
                default:
                    printHelp();
                    break;
            }
        })
        .catch((error) => {
            console.log('Unable to load local database files, please check the configurations and try again');
            console.log(error);
        });


}).catch((error) => {
    console.error(error);
});

