#!/usr/bin/env node
'use strict';

const RepositoryUtils = require('./repos/RepositoryUtils')();
const config = require('./configuration/config');
const LocalRepoUtils = require('./clone-workers/LocalRepoUtils')();



function printHelp() {
    console.log("2-async.js Help (C) Mahesh Kulkarni ");
    console.log("");
    console.log("Usage: ");
    console.log("--help                 Print this help");
    console.log("--file={NAME}          read then file {NAME} and output");
}