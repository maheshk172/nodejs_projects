"use strict";

const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');
const config = require('../../configuration/config.json');

const pullLatest = (repo) => {
    const pullChild = spawn('git', ['pull'], {
        cwd: `${repo.localPath}`
    });

    pullChild.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    pullChild.stdout.on('exit', function (code, signal) {
        console.log(`Pull process exited with ${code} and signal ${signal}`);
    });

    pullChild.on('close', (code) => {
        process.exit(0);
    });
};


process.on('message', (data) => {
   const status = pullLatest(data);
});