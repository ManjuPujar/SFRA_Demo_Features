'use strict';

var donationAttribute = function (object, lineItem) {
    var sitePreferenceGroupProductModule = require('*/cartridge/models/sitePreferenceGroupProductModule');
    var DonationProductID = sitePreferenceGroupProductModule.customPrefProduct();
    Object.defineProperty(object, 'isDonation', {
        enumerable: true,
        value: DonationProductID === lineItem.productID ? true : false
    });
};

module.exports = donationAttribute;
