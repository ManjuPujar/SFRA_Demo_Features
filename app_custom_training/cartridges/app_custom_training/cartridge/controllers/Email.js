'use strict';

/**
* @namespace controllers/Email
* Create a simple Asset with some Content and include the content asset body as the
* email email and trigger the Email.
*/

var server = require('server');

var ContentMgr = require('dw/content/ContentMgr');
var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');

server.get('Email', function (req, res, next) {
    var emailObject = {};
    emailObject.to = 'manjunath.pujar@merklecxm.com';
    emailObject.from = 'manjunath.Pujar@gmail.com';
    emailObject.subject = 'Asssignment on email triggering content Asset';
    var contentAsset = ContentMgr.getContent('Email');
    var displayBody = contentAsset.custom.body;
    var trial = {};
    trial.Display = displayBody;
    emailHelpers.send(emailObject, 'Training/email', trial);
    res.json({
        message: 'Email has been sent succesfully'
    });
    next();
});

module.exports = server.exports();
