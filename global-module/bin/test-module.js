#!/usr/bin/env node

var lib= require('../lib/server.js');
var greeting = lib.sayHello('Bret');

console.log(greeting);
