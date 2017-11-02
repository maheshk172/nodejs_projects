"use strict";
const request = require('request');
const Config = require('../configuration/Configuration');

const AdvancedRequest = () => {

    const generateOptions = (urlToCall) => {
        return {
            url: urlToCall,
            headers: {
                'User-Agent': 'request',
                'Authorization': `token ${process.env.GITHUB_TOKEN || Config.config.GITHUB_TOKEN}`
            }
        };
    };

    // GET Call for all Get Requests
    const get = (urlToCall) => {
        return new Promise((Resolve, Reject) => {
            request(generateOptions(urlToCall), (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    Resolve(data);
                } else {
                    Reject(error ? error : response.body);
                }
            });
        });
    };

    return {
        get: get
    }
};


module.exports = AdvancedRequest();