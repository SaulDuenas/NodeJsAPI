var express = require('express'),
  jwt = require('jsonwebtoken'),
  config = require('../config'),
  app = express();

function middlewareAuthorizationProvider(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(
      token, config.secret, function (err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });

  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
}

module.exports = middlewareAuthorizationProvider;