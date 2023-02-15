'use strict';

/**
 * @namespace  controllers/EmailSubscription
 * Create a form with fields First Name, Middle Name, Last Name, Email Address, Gender and are u Indian.
 */

var server = require('server');

/**
 * server.get('EmailList', server.middleware.https, function(req, res, next){
 * var emailSubscriptionForm = session.form.emailSubscription.xml;
 * next();
 * });
 */

// To fetch  our xml in plain way using server Module
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var Logger = require('dw/system/Logger');

server.get('EmailList', csrfProtection.generateToken, function (req, res, next) {
    var emailsubscription = server.forms.getForm('emailSubscription');
    emailsubscription.clear();
    res.render('Training/emailSubscription', {
        emailsubscription: emailsubscription
    });
    next();
});

server.post('Email', csrfProtection.validateAjaxRequest, function (req, res, next) {
    var Emailsubscription = server.forms.getForm('emailSubscription');
    var CustomObjectMgr = require('dw/object/CustomObjectMgr');
    var Transaction = require('dw/system/Transaction');
    var existCustomObject = CustomObjectMgr.getCustomObject('EmailList', Emailsubscription.email.value);
    try {
        if (!existCustomObject) {
            Transaction.wrap(function () {
                var newCustomObject = CustomObjectMgr.createCustomObject('EmailList', Emailsubscription.email.value);
                newCustomObject.custom.firstName = Emailsubscription.firstname.value;
                newCustomObject.custom.lastName = Emailsubscription.lastname.value;
                newCustomObject.custom.email = Emailsubscription.email.value;
                newCustomObject.custom.gender = Emailsubscription.gender.value;
                newCustomObject.custom.indian = Emailsubscription.indian.value;
            });
            res.setViewData({
                msg: 'Thanks for Email Registering'
            });
        } else {
            res.setViewData({
                msg: 'Already registered with this Email'
            });
        }
    } catch (e) {
        Logger.error('Error in the controller EmailSubscription {0}', e.message);
    }
    res.json();
    next();
});

module.exports = server.exports();
