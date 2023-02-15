'use strict';
var URLUtils = require('dw/web/URLUtils');

var server = require('server');

server.get('Email', function (req, res, next) {
    var CartUrl = URLUtils.http('Cart-Show');
    var loginUrl = URLUtils.http('Login-Show', 'rurl', '3');
    if (customer.authenticated) {
        res.redirect(CartUrl);
    } else {
        res.redirect(loginUrl);
    }
    next();
});

module.exports = server.exports();
