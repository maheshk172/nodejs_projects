"use strict";

const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');
const Config = require('../../configuration/Configuration');

const createDirectory = (targetDir) => {
    return new Promise((Resolve, Reject) => {
        const sep = path.sep;
        const initDir = path.isAbsolute(targetDir) ? sep : '';

        targetDir.split(sep).reduce((parentDir, childDir) => {
            const curDir = path.resolve(parentDir, childDir);
            if (!fs.existsSync(curDir)) {
                console.log(`Creating directory: ${curDir}`);
                fs.mkdirSync(curDir);
            } else {
                console.log(`${curDir} already exist`);
            }
            return curDir;
        }, initDir);

        Resolve();
    });
};

const cloneRepo = (repo) => {
    Config.init().then((newConfig) => {
        Config.config = newConfig;

        let baseDirectory = Config.config.LOCAL_REPO_BASE_PATH + '/' + repo.owner;
        console.log(baseDirectory);

        const localRepoTemplate = {
            name: '',
            owner: '',
            cloneUrl: '',
            localPath: ''
        };

        createDirectory(`${baseDirectory}`).then((data) => {

            if (fs.existsSync(`${Config.config.LOCAL_REPO_BASE_PATH}/${repo.owner}/${repo.name}`)) {
                console.log(`Directory already exist with repo name : ${repo.name}, worker shutdown`);
                process.exit(0);
            } else {
                console.log(`Cloning repo ${repo.cloneUrl} into directory: ${baseDirectory}`);

                const clone = spawn('git', ['clone', repo.cloneUrl], {
                    cwd: `${Config.config.LOCAL_REPO_BASE_PATH}/${repo.owner}`
                });

                clone.stdout.on('data', (data) => {
                    console.log(data);
                });

                clone.stdout.on('exit', function (code, signal) {
                    console.log(`Clone process exited with ${code} and signal ${signal}`);
                    console.log(`cloning failed for repository ${repo.cloneUrl}`);
                });

                clone.on('close', (code) => {
                    console.log(`repository ${repo.cloneUrl} has been downloaded successfully..., worker Shutdown`);
                    repo.localPath = `${Config.config.LOCAL_REPO_BASE_PATH}/${repo.owner}` + '/' + repo.name;
                    process.send(repo);
                    process.exit(0);
                });
            }
        }).catch((error) => {
            console.log('error thrown : ' + error);
            process.exit(0);
        });
    });


};

process.on('message', (data) => {
    const status = cloneRepo(data);
});