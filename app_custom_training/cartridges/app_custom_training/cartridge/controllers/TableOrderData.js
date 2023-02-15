'use strict';

/**
 * @namespace  controllers/TableOrderData
 * If customer is authenticated, get all orders placed by the user and then display
 * display the data on storefront like below table.
 * All the labels like Order Number, Billing Address First Name etc... should be from
 * resource bundles.
 * Create a module to prepare the data. No logic should be written directly in
 * Controller. Data preparation should happen in Module only.
 * Use decorator, do not display data in plain page. You can use existing decorator
 * (page.isml)
 * If customer is not authenticated redirect the customer to login page.
 */

var server = require('server');

var dataModule = require('../models/tableOrderDataModule');
var URLUtils = require('dw/web/URLUtils');
server.get('OrderDetails', function (req, res, next) {
    if (!customer.authenticated) {
        res.redirect(URLUtils.url('Login-Show'));
    } else {
        var orders = dataModule;
        // var listSize = orders.length;
        var listSize = orders.size();
        res.render('Training/tableOrderData', {
            orders: orders,
            listSize: listSize
        });
    }
    next();
});

module.exports = server.exports();
