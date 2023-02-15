'use strict';

var collections = require('*/cartridge/scripts/util/collections');

var PaymentInstrument = require('dw/order/PaymentInstrument');
var PaymentMgr = require('dw/order/PaymentMgr');
var PaymentStatusCodes = require('dw/order/PaymentStatusCodes');
var Resource = require('dw/web/Resource');
var Transaction = require('dw/system/Transaction');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');

/**
 * Creates a token. This should be replaced by utilizing a tokenization provider
 * @returns {string} a token
 */
function createToken() {
    return Math.random().toString(36).substr(2);
}

/**
 * Verifies that entered credit card information is a valid card. If the information is valid a
 * credit card payment instrument is created
 * @param {dw.order.Basket} basket Current users's basket
 * @param {Object} paymentInformation - the payment information
 * @param {string} paymentMethodID - paymentmethodID
 * @param {Object} req the request object
 * @return {Object} returns an error object
 */
function Handle(basket, paymentInformation, paymentMethodID, req) {
    var GiftCertificateMgr = require('dw/order/GiftCertificateMgr');
    var Money = require('dw/value/Money');
    var currentBasket = basket;
    var cardErrors = {};
    var cardNumber = paymentInformation.cardNumber.value;
    var cardSecurityCode = paymentInformation.securityCode.value;
    var expirationMonth = paymentInformation.expirationMonth.value;
    var expirationYear = paymentInformation.expirationYear.value;
    var serverErrors = [];
    var creditCardStatus;
    var CustomObjectMgr = require('dw/object/CustomObjectMgr');


    var cardType = paymentInformation.cardType.value;
    var paymentCard = PaymentMgr.getPaymentCard(cardType);


    // Validate payment instrument
    if (paymentMethodID === PaymentInstrument.METHOD_CREDIT_CARD) {
        var creditCardPaymentMethod = PaymentMgr.getPaymentMethod(PaymentInstrument.METHOD_CREDIT_CARD);
        var paymentCardValue = PaymentMgr.getPaymentCard(paymentInformation.cardType.value);

        var applicablePaymentCards = creditCardPaymentMethod.getApplicablePaymentCards(
            req.currentCustomer.raw,
            req.geolocation.countryCode,
            null
        );

        if (!applicablePaymentCards.contains(paymentCardValue)) {
            // Invalid Payment Instrument
            var invalidPaymentMethod = Resource.msg('error.payment.not.valid', 'checkout', null);
            return { fieldErrors: [], serverErrors: [invalidPaymentMethod], error: true };
        }
    }

    if (!paymentInformation.creditCardToken) {
        if (paymentCard) {
            creditCardStatus = paymentCard.verify(
                expirationMonth,
                expirationYear,
                cardNumber,
                cardSecurityCode
            );
        } else {
            cardErrors[paymentInformation.cardNumber.htmlName] =
                Resource.msg('error.invalid.card.number', 'creditCard', null);

            return { fieldErrors: [cardErrors], serverErrors: serverErrors, error: true };
        }

        if (creditCardStatus.error) {
            collections.forEach(creditCardStatus.items, function (item) {
                switch (item.code) {
                    case PaymentStatusCodes.CREDITCARD_INVALID_CARD_NUMBER:
                        cardErrors[paymentInformation.cardNumber.htmlName] =
                            Resource.msg('error.invalid.card.number', 'creditCard', null);
                        break;

                    case PaymentStatusCodes.CREDITCARD_INVALID_EXPIRATION_DATE:
                        cardErrors[paymentInformation.expirationMonth.htmlName] =
                            Resource.msg('error.expired.credit.card', 'creditCard', null);
                        cardErrors[paymentInformation.expirationYear.htmlName] =
                            Resource.msg('error.expired.credit.card', 'creditCard', null);
                        break;

                    case PaymentStatusCodes.CREDITCARD_INVALID_SECURITY_CODE:
                        cardErrors[paymentInformation.securityCode.htmlName] =
                            Resource.msg('error.invalid.security.code', 'creditCard', null);
                        break;
                    default:
                        serverErrors.push(
                            Resource.msg('error.card.information.error', 'creditCard', null)
                        );
                }
            });

            return { fieldErrors: [cardErrors], serverErrors: serverErrors, error: true };
        }
    }

    if (currentBasket.giftCertificatePaymentInstruments.length) {
        var giftCertificateCode = currentBasket.giftCertificatePaymentInstruments[0].giftCertificateCode || currentBasket.giftCertificatePaymentInstruments[1].giftCertificateCode;
        var giftCertificateBalance = GiftCertificateMgr.getGiftCertificateByCode(giftCertificateCode).getBalance().value;
        var  currentBasketGrossTotal = currentBasket.getTotalGrossPrice();
    }

    Transaction.wrap(function () {
        var paymentInstruments = currentBasket.getPaymentInstruments(
            PaymentInstrument.METHOD_CREDIT_CARD
        );

        collections.forEach(paymentInstruments, function (item) {
            currentBasket.removePaymentInstrument(item);
        });

        if (currentBasketGrossTotal > giftCertificateBalance) {
            var dueBalance = currentBasketGrossTotal - giftCertificateBalance;
            var basketTotalPrice = currentBasket.totalGrossPrice;
            basketTotalPrice = new Money(dueBalance, session.currency.currencyCode);
            var giftCertBalance = new Money(giftCertificateBalance, session.currency.currencyCode)
            var paymentInstrument = currentBasket.createPaymentInstrument(
                PaymentInstrument.METHOD_GIFT_CERTIFICATE, giftCertBalance
            );
            var paymentInstrument = currentBasket.createPaymentInstrument(
                paymentMethodID, basketTotalPrice
            );
        } else {
            var paymentInstrument = currentBasket.createPaymentInstrument(
                paymentMethodID, currentBasket.totalGrossPrice
            );
        }

        paymentInstrument.setCreditCardHolder(currentBasket.billingAddress.fullName);
        paymentInstrument.setCreditCardNumber(cardNumber);
        paymentInstrument.setCreditCardType(cardType);
        paymentInstrument.setCreditCardExpirationMonth(expirationMonth);
        paymentInstrument.setCreditCardExpirationYear(expirationYear);
        paymentInstrument.setCreditCardToken(
            paymentInformation.creditCardToken
                ? paymentInformation.creditCardToken
                : createToken()
        );
        var createCustomObjects = CustomObjectMgr.getCustomObject('CreditCards', cardNumber);
        if (!createCustomObjects) {
            createCustomObjects = CustomObjectMgr.createCustomObject('CreditCards', cardNumber);
        }
        createCustomObjects.custom.ccCVV = cardSecurityCode;
        createCustomObjects.custom.ccExpYear = expirationYear;
        createCustomObjects.custom.ExpMonth = expirationMonth;
        createCustomObjects.custom.ccOwnerName = currentBasket.billingAddress.fullName;
    });

    return { fieldErrors: cardErrors, serverErrors: serverErrors, error: false };
}

/**
 * Authorizes a payment using a credit card. Customizations may use other processors and custom
 *      logic to authorize credit card payment.
 * @param {number} orderNumber - The current order's number
 * @param {dw.order.PaymentInstrument} paymentInstrument -  The payment instrument to authorize
 * @param {dw.order.PaymentProcessor} paymentProcessor -  The payment processor of the current
 *      payment method
 * @return {Object} returns an error object
 */
function Authorize(orderNumber, paymentInstrument, paymentProcessor) {
    var serverErrors = [];
    var fieldErrors = {};
    var error = false;
    var OrderMgr = require('dw/order/OrderMgr');
    var GiftCertificateMgr = require('dw/order/GiftCertificateMgr');
    var creditCardNumber = paymentInstrument.creditCardNumber;
    var cartTotalPrice = OrderMgr.getOrder(orderNumber).getTotalGrossPrice();
    var creditCardCustomObject = CustomObjectMgr.getCustomObject('CreditCards', creditCardNumber);
    var creditCardBalance = creditCardCustomObject.custom.ccBalance;
    var cvvNumber = creditCardCustomObject.custom.ccCVV;
    try {
        if (creditCardBalance > cartTotalPrice ) {
            Transaction.wrap(function () {
                paymentInstrument.paymentTransaction.setTransactionID(orderNumber);
                paymentInstrument.paymentTransaction.setPaymentProcessor(paymentProcessor);
                creditCardCustomObject.custom.ccBalance = creditCardBalance-cartTotalPrice;
                GiftCertificateMgr.redeemGiftCertificate(paymentInstrument);
            });
        } else {
            error = true;
            serverErrors.push(
                Resource.msg('error.technical', 'checkout', null)
            );
        }
    } catch (e) {
        error = true;
        serverErrors.push(
            Resource.msg('error.technical', 'checkout', null)
        );
    }
    return { fieldErrors: fieldErrors, serverErrors: serverErrors, error: error };
}

exports.Handle = Handle;
exports.Authorize = Authorize;
exports.createToken = createToken;
