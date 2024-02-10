"use strict";
const {ensureLoggedIn} = require('connect-ensure-login');

module.exports = {
  auth: function (req, res, next) {
    if( req.user && req.user.csrf && req.user.csrf === req.headers['x-csrf-token']) (ensureLoggedIn())(req,res,next);
    else return res.status(401).end();
  }
}