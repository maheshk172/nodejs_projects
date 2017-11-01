"use strict";
const request = require('request');
const config = require('../configuration/config');

const AdvancedRequest = () => {

    const generateOptions = (urlToCall) => {
        return {
            url: urlToCall,
            headers: {
                'User-Agent': 'request',
                'Authorization': `token ${process.env.GITHUB_TOKEN || config.GITHUB_TOKEN}`
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
                    Reject(error);
                }
            });
        });
    };

    return {
        get: get
    }
};


module.exports = AdvancedRequest();