'use strict';

var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var ProductMgr = require('dw/catalog/ProductMgr');
var emailHelpers = require('app_storefront_base/cartridge/scripts/helpers/emailHelpers.js');
var URLUtils = require('dw/web/URLUtils');
var Transaction = require('dw/system/Transaction');
var Logger = require('dw/system/Logger');

var notificationProductBackInOrderAvailability = function () {
    var getCustomObjects = CustomObjectMgr.getAllCustomObjects('NotifyProductAvailabilty');
    try {
        while (getCustomObjects.hasNext()) {
            var individualcustomObject = getCustomObjects.next();
            var productid = individualcustomObject.custom.productIds;
            var product = ProductMgr.getProduct(productid);
            var firstName = individualcustomObject.custom.firstName;
            var lastName = individualcustomObject.custom.lastName;
            var emailAddress = individualcustomObject.custom.emailAddress;

            var inventoryATS;
            if (!product.availabilityModel.inventoryRecord) {
                inventoryATS = 0;
            } else {
                inventoryATS = product.availabilityModel.inventoryRecord.getATS().value;
            }
            var productUrl = URLUtils.http('Product-Show');
            productUrl = productUrl + '?pid=' + productid;

            if (inventoryATS > 4) {
                var emailObject = {};
                emailObject.to = emailAddress;
                emailObject.from = 'manjunathPujar@gmail.com';
                emailObject.subject = 'Asssignment on notify Product Back In Order Availability';

                var details = {};
                details.productUrl = productUrl;
                details.firstName = firstName;
                details.lastName = lastName;
                emailHelpers.send(emailObject, 'Training/notifyProductInStockAvailabilityEmailTrigger', details);
            }
            Transaction.begin();
            CustomObjectMgr.remove(individualcustomObject);
            Transaction.commit();
        }
    } catch (e) {
        Logger.error('Error in the Script file while executing While loop {0}', e.message);
    }
};

module.exports.notificationProductBackInOrderAvailability = notificationProductBackInOrderAvailability;
