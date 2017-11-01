"use strict";

const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');

const createDirectory = (targetDir) => {
    return new Promise((Resolve, Reject) => {
        const sep = path.sep;

        const initDir = path.isAbsolute(targetDir) ? sep : '';

        targetDir.split(sep).reduce((parentDir, childDir) => {
            const curDir = path.resolve(parentDir, childDir);
            if (!fs.existsSync(curDir)) {
                fs.mkdirSync(curDir);
            }

            return curDir;
        }, initDir);

        Resolve();
    });
};


const cloneRepo = (repo, owner) => {
    console.log(`Creating directory: /projects_1/github/${owner}`);

    createDirectory(`/projects_1/github/${owner.toString()}`).then((data) => {
        console.log(`Cloning repo ${repo} into directory: /projects/github/${owner}`);
        const clone = spawn('git', ['clone', repo], {
            cwd: `/projects_1/github/${owner}`
        });

        clone.stdout.on('data', (data) => {
            console.log(data);
        });

        clone.stdout.on('exit', function (code, signal) {
            console.log(`Clone process exited with ${code} and signal ${signal}`);
            console.log(`cloning failed for repository ${repo}`);
        });

        clone.on('close', (code) => {
            process.send(`repository ${repo} has been downloaded successfully...`);
            process.exit(0);
        });

    }).catch((error) => {
        console.log('error thrown : ' + error);
    });
};

process.on('message', (data) => {
    const status = cloneRepo(data.repoUrl, data.owner);
});