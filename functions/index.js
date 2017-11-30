const functions = require('firebase-functions');
const express = require('./lib/express');

exports.tools = functions.https.onRequest(express);
