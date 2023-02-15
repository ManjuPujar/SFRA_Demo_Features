'use strict';

var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var emailHelpers = require('app_storefront_base/cartridge/scripts/helpers/emailHelpers.js');
var URLUtils = require('dw/web/URLUtils');

var emailForAbandonedcart = function () {
    var abandonedCartUserDetails = CustomObjectMgr.getAllCustomObjects('AbandonedCart').asList();
    for (let index = 0; index < abandonedCartUserDetails.length; index++) {
        var firstName = abandonedCartUserDetails[index].custom.firstName;
        var lastName = abandonedCartUserDetails[index].custom.lastName;
        var emailAddress = abandonedCartUserDetails[index].custom.EmailAddress;
        var customObjLastModifiedTime = abandonedCartUserDetails[index].lastModified.getTime();
        var currentTime = new Date().getTime();
        var diffTimeInMiliSec = currentTime-customObjLastModifiedTime;
        var requireTimeInMins = (diffTimeInMiliSec/1000)/60;
        var controllerURL = URLUtils.abs('AbandonedCartUserRedirecting-Email');
        var emailObject = {};
            emailObject.to = emailAddress;
            emailObject.from = 'manjunathPujar@gmail.com';
            emailObject.subject = 'Asssignment on Abandoned Cart';

        var details = {};
            details.controllerURL = controllerURL;
            details.firstName = firstName;
            details.lastName = lastName;
        if(requireTimeInMins > 1) {
            emailHelpers.send(emailObject, 'Training/emailForAbandonedCartUser', details);
        }
    }
}

module.exports.emailForAbandonedcart = emailForAbandonedcart;
