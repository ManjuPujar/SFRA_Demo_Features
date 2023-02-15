'use strict';

var ArrayList = require('dw/util/ArrayList');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var Transaction = require('dw/system/Transaction');
var URLUtils = require('dw/web/URLUtils');

/**
 * Storing the Customer Details and the product Ids of the products which are in the cart
 * @param currentBasket
 */
var abandonedCart = function (currentBasket) {
    var productIDsList = new ArrayList();
    if (currentBasket) {
        var allProductLineItems = currentBasket.getAllProductLineItems();
    }
    var customerProfile = customer.profile;
    if (customerProfile) {
        var firstname = customerProfile.firstName;
        var lastname = customerProfile.lastName;
        var emailAddress = customerProfile.email;
        var abandonedUserDetails = CustomObjectMgr.getCustomObject('AbandonedCart', emailAddress);
        if (!abandonedUserDetails) {
            Transaction.wrap(function () {
            var createabandonedUserDetails = CustomObjectMgr.createCustomObject('AbandonedCart', emailAddress);
            if (currentBasket) {
                for (let index = 0; index < allProductLineItems.length; index++) {
                    var productID = allProductLineItems[index].productID;
                    productIDsList.add(productID);
                }
            }
            createabandonedUserDetails.custom.EmailAddress = emailAddress;
            createabandonedUserDetails.custom.firstName = firstname;
            createabandonedUserDetails.custom.lastName = lastname;
            createabandonedUserDetails.custom.productIds = productIDsList;
            });
        } else {
            for (let index = 0; index < allProductLineItems.length; index++) {
                var productID = allProductLineItems[index].productID;
                productIDsList.add(productID);
            }
            Transaction.wrap(function () {
                var customProductIDs =  abandonedUserDetails.custom.productIds;
                customProductIDs.forEach(function (productIds) {
                    productIDsList.add(productIds);
                });
                abandonedUserDetails.custom.productIds = productIDsList;
            });
        }
    }
}

/**
 * on removing the products in the Cart
 * Deleting the data in the custom object and adding the product ids again
 * @param currentBasket
 */
var updatedAbandonedCart = function (currentBasket) {
    var updatedList = new ArrayList();
    var emailAddress = customer.profile.email;
    var abandonedUserDetails = CustomObjectMgr.getCustomObject('AbandonedCart', emailAddress);
    var allProductLineItems = currentBasket.getAllProductLineItems();
    var allproductLineItemslength = allProductLineItems.size();
    delete abandonedUserDetails.custom.productIds;
    for (let index = 0; index < allProductLineItems.length; index++) {
        var productID = allProductLineItems[index].productID;
        updatedList.add(productID);
    }
    Transaction.wrap(function () {
        abandonedUserDetails.custom.productIds = updatedList;
    });
    if(allproductLineItemslength === 0) {
        Transaction.wrap(function () {
        var abandonedUserDetails = CustomObjectMgr.getCustomObject('AbandonedCart', emailAddress);
        CustomObjectMgr.remove(abandonedUserDetails);
        });
    };
}

/**
 * Removing all the custom Object records once the ordwer is confirmed.
 * @param orderID
 */
var removeRecordsOnceOrderConfirmed = function (orderID) {
    var emailAddress = customer.profile.email;
    var abandonedUserDetails = CustomObjectMgr.getCustomObject('AbandonedCart', emailAddress);
    if (orderID) {
        if (abandonedUserDetails) {
            Transaction.wrap(function () {
                CustomObjectMgr.remove(abandonedUserDetails);
            });
        }
    }

}

module.exports = {
    abandonedCart: abandonedCart,
    updatedAbandonedCart: updatedAbandonedCart,
    removeRecordsOnceOrderConfirmed: removeRecordsOnceOrderConfirmed
}
