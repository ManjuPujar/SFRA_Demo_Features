'use strict';

/**
 * @namespace  controllers/AuthenticatedCustomer1
 * Create a Controller which will be accessible for only authenticated customers.
 * If a guest user tries to access your controller it should get redirected to login
 * page.
 */

var server = require('server');

var URLUtils = require('dw/web/URLUtils');

server.get('Authenticated', function (req, res, next) {
    if (!req.currentCustomer.profile) {
        res.redirect(URLUtils.url('Login-Show'));
    } else {
        res.render('Training/authenticatedCustomer');
    }
    next();
});

module.exports = server.exports();
