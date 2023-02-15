'use strict';

/**
 * @namespace  controllers/NotifyProductBackInStock
 * In PDP if the product/Variant is Out of Stock, then show a form to user to subscribe for back in stock notification.
 * Form Should collect following Data,
 *      -First Name
 *      -Last Name
 *      -Email Address
 * Submit form by using Ajax and show confirmation in the same page.
 * Store these details in a custom object (Key: UUID)
 * Create a job to iterate over all the custom objects and check the inventory of the item stored in Custom Object.
 * If the inventory of the item is more than 5 then send an email to the email address store in Custom Object saying the item is back in stock.
 * Once the email is sent then delete Custom Object record.
 * Email Should Contain,
 * Hi FirstName, Last Name
 * The item <PDP URL> is back in stock.
 */

var server = require('server');

var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var Transaction = require('dw/system/Transaction');
var UUIDUtils = require('dw/util/UUIDUtils');
var Logger = require('dw/system/Logger');

server.post('Availability', function (req, res, next) {
    var notificationDataForm = server.forms.getForm('notifyProductInStockAvailability');
    var uniqueID = UUIDUtils.createUUID();
    try {
        Transaction.wrap(function () {
            var newCustomObject = CustomObjectMgr.createCustomObject('NotifyProductAvailabilty', uniqueID);
            newCustomObject.custom.firstName = notificationDataForm.firstname.value;
            newCustomObject.custom.lastName = notificationDataForm.lastname.value;
            newCustomObject.custom.emailAddress = notificationDataForm.email.value;
            newCustomObject.custom.productIds = notificationDataForm.productID.value;
            notificationDataForm.clear();
        });
        res.setViewData({
            msg: 'Thanks For Subscribing Email Notification'
        });
    } catch (e) {
        Logger.error('Error while executing the Data Base Transaction {0}', e.message);
    }
    res.json();
    next();
});

module.exports = server.exports();
