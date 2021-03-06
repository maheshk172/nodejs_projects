"use strict";

const ConfigFileHelper = require('./ConfigFileHelper');
const fs = require('fs');

const ConfigBuilder = () => {

    const defaultConfig = {
        "USER_NAME": "",
        "GITHUB_TOKEN": "",
        "GIT_API_BASE_PATH": "https://api.github.com",
        "GIT_BASE_PATH": "https://github.com",
        "LOCAL_REPO_BASE_PATH": "/projects_1/github",
        "EXCLUDE_REPOS": []
    };

    let config = {};

    const init = () => {
        return new Promise((Resolve, Reject) => {
            ConfigFileHelper.getConfigFromHomeDirectory().then((userConfig) => {
                config = ConfigFileHelper.mergeConfigObjects(defaultConfig, userConfig);
                Resolve(config);
            });
        });
    };

    const createUserConfigFile = () => {
        ConfigFileHelper.createDefaultConfigFile(defaultConfig);
    };

    return {
        init: init,
        config: config,
        createDefaultConfigFile: createUserConfigFile
    };

};


module.exports = ConfigBuilder();

