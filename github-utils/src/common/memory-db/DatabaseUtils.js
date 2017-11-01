"use strict";

const fs = require('fs');
const _ = require('lodash');

const DatabaseUtils = () => {
    let dbFile = './common/memory-db/memory_db.dat';

    //schema
    const localRepoTemplate = {
        name: '',
        owner: '',
        cloneUrl: '',
        localPath: ''
    };

    let localRepos = [];

    let addRepo = (newRepo) => {
        if (_.find(localRepos, (repo) => {
                return repo.name === newRepo.name;
            })) {
            console.log('Repo details already exist in the database');
            return;
        }

        console.log(`Adding new repo: ${newRepo.name} to database ${dbFile}`);

        let localRepo = Object.assign({}, localRepoTemplate);
        localRepo.name = newRepo.name;
        localRepo.owner = newRepo.owner;
        localRepo.cloneUrl = newRepo.cloneUrl;
        localRepo.localPath = newRepo.localPath;

        localRepos.push(localRepo);

        fs.writeFile(dbFile, JSON.stringify(localRepos), (error) => {
            if (error) {
                console.error('Unable to update underline local database, error thrown', error);
                throw error;
            }

            console.log('Local Database has been refreshed successfully');
        });
    };

    let getRepoDetails = (reponame) => {
        return _.find(localRepos, (repo) => {
            return repo.name === reponame;
        });
    };

    let getRepos = () => {
        let result = Object.assign([], localRepos);
        return result;
    };


    /*let refreshLocalCache = () => {
        console.log('refreshing the database');

        fs.readFile(dbFile, (error, contents) => {

            if (error) {
                console.log('silently existing.. error thrown: ', error);
                return;
            }

            let parsedContents = JSON.parse(contents);

            if (!_.isEqual(parsedContents, localRepos)) {
                console.log('Refreshing local Cache..');
                console.log('Contents from database: ', contents.toString());
                localRepos = parsedContents;
            } else {
                console.log('contents are still same, no need to refresh local cache..');
            }
        });
    };*/

    let init = () => {
        return new Promise((Resolve, Reject) => {
            fs.readFile(dbFile, (error, contents) => {
                if (error) {
                    console.error('error while loading the local memory db: ', error);
                    Reject(error);
                }
                localRepos = JSON.parse(contents);
                Resolve();
            });

            //keep reloading local cache every 1 min
            /*
            setInterval(() => {
                console.log('triggering the change again');
                refreshLocalCache();
            }, 10000);
            */
        });
    };

    return {
        addRepo: addRepo,
        getRepoDetails: getRepoDetails,
        getRepos: getRepos,
        init: init
    };
};

module.exports = DatabaseUtils();