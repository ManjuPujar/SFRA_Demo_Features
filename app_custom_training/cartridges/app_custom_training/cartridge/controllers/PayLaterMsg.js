'use strict';

var server = require('server');

server.post('Display', function( req, res, next) {
    res.json({
        msg: paid
    })
    next();
});

module.exports = server.exports();