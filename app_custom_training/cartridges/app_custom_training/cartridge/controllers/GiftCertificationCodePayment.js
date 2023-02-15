'use strict';

var server = require('server');

var GiftCertificateMgr = require('dw/order/GiftCertificateMgr');

server.post('Check', function (req, res, next) {
    var giftCardCode = req.form.giftCardCode;
    var giftCertificate =  GiftCertificateMgr.getGiftCertificateByCode(giftCardCode);
    var giftCardCodeBalance = giftCertificate.balance.value;
    res.setViewData({
        giftCardCodeBalance: 'Balanace in Your GiftCard is $' + giftCardCodeBalance
    });
    res.json();
    next();
});

server.post('Redeem', function (req, res, next) {
    var GiftCertificate = require('dw/order/GiftCertificate');
    var GiftCertificateMgr = require('dw/order/GiftCertificateMgr');
    var GiftCertificateStatusCodes = require('dw/order/GiftCertificateStatusCodes');
    var BasketMgr = require('dw/order/BasketMgr');
    var Status = require('dw/system/Status');
    var Transaction = require('dw/system/Transaction');
    var Logger = require('dw/system/Logger').getLogger('giftCertification', 'giftCardApply');

    var statusResult, redeemMsg, boolean, payingAmount, redeemMessage, Displaymessage, statusCode;

    var giftCardCode = req.form.giftcardCode;
    var giftCertificate = GiftCertificateMgr.getGiftCertificateByCode(giftCardCode) || null;
    var currentBasket = BasketMgr.getCurrentBasket();
    try {
        if (currentBasket) {
            if (!giftCertificate) {
                statusResult = new Status(Status.ERROR, GiftCertificateStatusCodes.GIFTCERTIFICATE_NOT_FOUND)
            } else if (!giftCertificate.isEnabled()) {// make sure it is enabled
                statusResult = new Status(Status.ERROR, GiftCertificateStatusCodes.GIFTCERTIFICATE_DISABLED);
            } else if (giftCertificate.getStatus() === GiftCertificate.STATUS_PENDING) {// make sure it is available for use
                statusResult = new Status(Status.ERROR, GiftCertificateStatusCodes.GIFTCERTIFICATE_PENDING);
            } else if (giftCertificate.getStatus() === GiftCertificate.STATUS_REDEEMED) {// make sure it has not been fully redeemed
                statusResult = new Status(Status.ERROR, GiftCertificateStatusCodes.GIFTCERTIFICATE_INSUFFICIENT_BALANCE);
            } else if (giftCertificate.balance.currencyCode !== currentBasket.getCurrencyCode()) {// make sure the giftCertificate is in the right currency
                statusResult = new Status(Status.ERROR, GiftCertificateStatusCodes.GIFTCERTIFICATE_CURRENCY_MISMATCH);
            } else {
                var newgiftCertificatePaymentInstrument = Transaction.wrap(function () {
                    var giftCertificatePaymentInstrument = currentBasket.createGiftCertificatePaymentInstrument(giftCardCode, giftCertificate.amount);
                    return giftCertificatePaymentInstrument;
                });
            }

            var giftCardCodeBalance = giftCertificate.balance.value;
            var cartTotalprice = currentBasket.getTotalGrossPrice();
            var maskedgiftCertificate = giftCertificate.getMaskedGiftCertificateCode();
            if (giftCardCodeBalance >= cartTotalprice) {
                boolean = true;
                redeemMessage = "$" + cartTotalprice + " has been redeemed by gift certification code - " + maskedgiftCertificate;
                statusResult = new Status(Status.OK,redeemMessage);
                giftCardCodeBalance = giftCardCodeBalance - cartTotalprice;
            } else {
                boolean = false;
                payingAmount = cartTotalprice - giftCardCodeBalance;
                redeemMessage = "$" + giftCardCodeBalance + " has been redeemed by gift certification code - " + maskedgiftCertificate + " Paying amount is $" + payingAmount;
                statusResult = new Status(Status.OK, redeemMessage);
            }
        } else {
            statusResult = new Status(Status.ERROR, "No Product in the Cart")
        }
    } catch (error) {
        Logger.error('Error in the giftCertificationCodePayment.js controller {0}', error.message);
    }
    Displaymessage = statusResult.message;
    statusCode = statusResult.status;
    res.json({
        Displaymessage: Displaymessage,
        boolean: boolean,
        statusCode: statusCode
    });
    next();
});

server.post('Remove', function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var Logger = require('dw/system/Logger').getLogger('giftCertification', 'giftCardRemove');
    var giftCardCode = req.form.giftCertificationCode;
    try {
        var currentBasket = BasketMgr.getCurrentBasket();
        var paymentInstruments = currentBasket.getGiftCertificatePaymentInstruments(giftCardCode).iterator();
        while (paymentInstruments.hasNext()){
            var paymentInstrument = paymentInstruments.next();
            currentBasket.removePaymentInstrument(paymentInstrument);
            res.setViewData({
                deleteMsg: 'GiftCertificate Code Removed'
            });
        }
    } catch (error) {
        Logger.error('Error in the giftCertificationCodePayment.js controller {0}', error.message);
    }
    res.json();
    next();
});

module.exports = server.exports();
