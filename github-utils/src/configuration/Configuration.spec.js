"use strict";

var Config = require('./Configuration');

function TestConfiguration() {

    Config.init().then((newConfig) => {
        Config.config = newConfig;
        console.log(Config);
        console.log(Config.getConfig());

    }).catch((err) => {

    });
}

TestConfiguration();