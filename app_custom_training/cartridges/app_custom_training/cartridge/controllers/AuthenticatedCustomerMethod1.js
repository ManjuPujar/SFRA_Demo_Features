'use strict';

/**
 * @namespace controllers/AuthenticatedCustomerMethod1
 * Create a Controller which will be accessible for only authenticated customers.
 * If a guest user tries to access your controller it should get redirected to login
 * page.
 */

var server = require('server');

var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');

server.get('Authenticated',
    userLoggedIn.validateLoggedIn,
    function (req, res, next) {
        res.render('Training/authenticatedCustomer');
        next();
    });

module.exports = server.exports();
