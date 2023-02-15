'use strict';

/**
 * @nampace Donation
 * @Form donation.xml form
 */
var server = require('server');

server.get('Form', function (req, res, next) {
    var donationForm = server.forms.getForm('donationForm');
    /**
     * @module sitePreferenceGroupProductModule.js
     * @returns donation prodiuct ID.
     */
    var sitePreferenceGroupValues = require('*/cartridge/models/sitePreferenceGroupProductModule');
    var productID = sitePreferenceGroupValues.customPrefProduct();
    res.render('Training/donationForm', {
        donationForm: donationForm,
        productID: productID
    });
    next();
});

module.exports = server.exports();
