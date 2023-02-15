'use strict';

/**
 * @namespace  controllers/CustomObjectUrl
 * Create a custom object with two custom attributes.
 *	1.EmailAddress(key) & 2.Product IDs (Set of Strings)
 * Create a controller to read to emailAddress & pid parameters from URL
 * Insert record into the custom object created before, to save email Address & pid.
 * If a record already exists in custom object with same email ID then keep emailCOexist the pid's to the
 * same record.
 */

var server = require('server');

var Transaction = require('dw/system/Transaction');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var ArrayList = require('dw/util/arrayList');
var Logger = require('dw/system/Logger');
var arrayList = new ArrayList();

server.get('CustomUrlRead', function (req, res, next) {
    var PID = req.querystring.pid;
    var email = req.querystring.email;
    var ProductMgr = require('dw/catalog/ProductMgr');
    var productExist = ProductMgr.getProduct('PID');
    /**
     * Getting Custom Object with respect to key value
     * emailCOexist contains key(Email) attribute value and Pid attribute values
     */
    var emailCOexist = CustomObjectMgr.getCustomObject('MyCustomObject', email);
    if (!PID || !email) {
        throw Error('Its a Error, Showing because of Email and PID Not Found');
    } else {
        /**
         * checking if the given product in the url exist or not in business manager in the line number 34
         */
        if (productExist) {
            Transaction.begin();
            if (emailCOexist) {
                arrayList.add(PID);
                var pidValue = emailCOexist.custom.PID;
                pidValue.forEach(function (ProductID) {
                    arrayList.add(ProductID);
                });
                emailCOexist.custom.PID = arrayList;
            } else {
                var newEmailCustomObject = CustomObjectMgr.createCustomObject('MyCustomObject', email);
                arrayList.add(PID);
                newEmailCustomObject.custom.PID = arrayList;
            }
            Transaction.commit();
        } else {
            Logger.error('The given product in the url doesnt exist in the business manager');
        }
        var allCustomObjects = CustomObjectMgr.getAllCustomObjects('MyCustomObject');
        var allCustomobjectList = allCustomObjects.asList();
        res.render('Training/customObjectUrl', {
            allCustomobjectList: allCustomobjectList
        });
    }
    next();
});

module.exports = server.exports();
