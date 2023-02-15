'use strict';
var server = require('server');

server.extend(module.superModule);

server.prepend('SubmitPayment', function(req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var GiftCertificateMgr = require('dw/order/GiftCertificateMgr');
    var paymentForm = server.forms.getForm('billing');
    var currentBasket = BasketMgr.currentBasket;
    var basketTotal = currentBasket.totalGrossPrice.value;
    var hasGiftCertificate = currentBasket.getGiftCertificatePaymentInstruments();
    var giftCertCode;
    if (hasGiftCertificate.length) {
        for (let index = 0; index < currentBasket.giftCertificatePaymentInstruments.length; index++) {
            if (!giftCertCode) {
                giftCertCode = currentBasket.giftCertificatePaymentInstruments[index].giftCertificateCode;
            }
        }
        if (giftCertCode) {
            var giftCertificateBalance = GiftCertificateMgr.getGiftCertificateByCode(giftCertCode).getBalance().value;
            if (giftCertificateBalance >= basketTotal) {
                paymentForm.paymentMethod.value = 'GIFT_CERTIFICATE';
            }
        }
    }
    return next();
});

module.exports = server.exports();
