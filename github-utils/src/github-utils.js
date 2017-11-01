#!/usr/bin/env node
'use strict';

const RemoteRepoUtils = require('./services/RemoteRepoUtils');
const config = require('./configuration/config');
const DatabaseUtils = require('./common/memory-db/DatabaseUtils');
const LocalRepoUtils = require('./services/LocalRepoUtils');

DatabaseUtils.init()
    .then(() => {
        function printHelp() {
            console.log("");
            console.log("github-utils Help (C) Mahesh Kulkarni 2017");
            console.log("");
            console.log("Usage: ");
            console.log("--help                                   Print this help");
            console.log("--clone-all                              Search for your userid and clone all personal services and services from orgs where you contribute");
            console.log("--show-all                               Show all services cloned previously");
            console.log("--show-details {repo-name}               Show details for repository");
            console.log("--clone {repo-url}                       Clone a new repository and add on utility");
            console.log("--pull-latest {repo-name}                  Pull latest for repository from remote");
        }

        // args[0] -> command
        // args[1] -> first Param
        // args[2] -> second param
        var args = process.argv.slice(2);
        console.log(args);

        if (args[0] === '--help' || args.length === 0) {
            printHelp();
            process.exit(1);
        }

        let command = args[0].substr(2, args[0].length - 1);


        switch (command) {
            case 'clone-all':
                RemoteRepoUtils.getAllReposForUser(config.USER_NAME)
                    .then(LocalRepoUtils.cloneRepos)
                    .catch((error) => {
                        console.error(error);
                    });
                break;
            case 'show-all':
                LocalRepoUtils.getRepos();
                break;
            case 'show-details':
                if (args[1])  {
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
            default:
                printHelp();
                break;
        }
    })
    .catch((error) => {
        console.log('Unable to load local database files, please check the configurations and try again');
        console.log(error);
    });


