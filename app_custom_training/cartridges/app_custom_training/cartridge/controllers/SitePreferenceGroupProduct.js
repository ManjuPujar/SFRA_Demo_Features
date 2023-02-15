'use strict';

/**
 * @namespace  controllers/SitePreferenceGroupProduct
 * Create a Custom attribute and group it under Custom Site Preference
 * Groups and add the products.
 * Create a Module to fetch the details of the products and store it in the
 * ArrayList and pass the list to the controller and then to the isml template
 * to display the details of the products.
 */

var server = require('server');

server.get('SitePreference', function (req, res, next) {
    var sitePreferenceGroupValues = require('*/cartridge/models/sitePreferenceGroupProductModule');
    var module = sitePreferenceGroupValues.productList();
    res.render('Training/sitePreferenceGroupProduct', {
        object: module
    });
    next();
});

module.exports = server.exports();
