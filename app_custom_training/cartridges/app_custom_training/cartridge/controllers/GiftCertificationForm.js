'use strict';

var server = require('server');

server.get('Form', function (req, res, next) {
    try {
        var giftCertificateForm = server.forms.getForm('giftCertificationCardForm');
    } catch (error) {
        var msg = error.message;
    }
    res.render('Training/giftCertificationForm',{
        giftCertificateForm: giftCertificateForm
    });
    next();
});

module.exports = server.exports();