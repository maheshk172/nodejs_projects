"use strict";

const fs = require('fs');
const os = require('os');
const path = require('path');

const ConfigFileHelper = () => {
    const loadPropertiesFromFile = (filePath) => {
        return new Promise((Resolve, Reject) => {
            if (fs.existsSync(filePath)) {
                let contentsFromFile = fs.readFileSync(filePath);
                Resolve(contentsFromFile.toString());
            } else {
                Reject('The Config Path does not exist, create \'.gitutils-rc\' file at that location, refer --help');
            }
        });
    };

    /**
     * Ignore the lines statring with #, # is comments here
     */

    const buildConfigObject = (fileContent) => {
        return new Promise((Resolve, Reject) => {
            let configTemplate = {}

            if (fileContent) {
                let lineArray = fileContent.split('\n');
                lineArray.forEach(line => {
                    let positionOfEqual = line.indexOf('=');
                    if (positionOfEqual != -1 && !line.startsWith('#')) {
                        let key = line.substr(0, positionOfEqual).trim();
                        let value = line.substr(positionOfEqual + 1, line.length).trim();
                        configTemplate[key] = value;
                    }
                });
            }
            Resolve(configTemplate);
        });
    };

    const getConfigFromHomeDirectory = () => {

        return new Promise((Resolve, Reject) => {

            let userHomeDirectory = os.homedir();
            loadPropertiesFromFile(path.join(userHomeDirectory, '.gitutils-rc'))
                .then(buildConfigObject)
                .then((userConfig) => {
                    Resolve(userConfig);
                })
                .catch((error) => {
                    Reject(error);
                });
        });


    };

    const mergeConfigObjects = (defaultConfig, userConfig) => {
        let finalConfig = Object.assign({}, defaultConfig);
        if (userConfig) {
            let keys = Object.keys(userConfig);
            keys.forEach((key) => {
                finalConfig[key] = userConfig[key];
            });
        }
        return finalConfig;
    };

    const createDefaultConfigFile = (defaultConfig) => {
        let configFilePath = path.join(os.homedir(), '.gitutils-rc');
        fs.writeFile(configFilePath, JSON.stringify(defaultConfig), (error) => {
            if (error) {
                console.error('Unable to create default config file, error thrown: ', error);
                throw error;
            }

            console.log(`${configFilePath} file created with default values, please amend them with your credentials`);
        });
    };

    return {
        getConfigFromHomeDirectory: getConfigFromHomeDirectory,
        mergeConfigObjects: mergeConfigObjects,
        createDefaultConfigFile: createDefaultConfigFile
    };
};


module.exports = ConfigFileHelper();