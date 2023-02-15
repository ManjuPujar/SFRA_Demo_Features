'use strict';

var Status = require('dw/system/Status');
var Logger = require('dw/system/Logger');

function donationProductInBasketDetails(currentBasket, req) {
    var Transaction = require('dw/system/Transaction');
    var donatingProductID = req.form.pid;
    var donatorFirstName = req.form.firstName;
    var donatorLastName = req.form.lastName;
    var donatorEmailAddress = req.form.emailAddress;
    var donatedAmount = parseInt(req.form.amount);
    try {
        if (donatingProductID) {
            Transaction.begin();
            var allProductLineItems = currentBasket.getAllProductLineItems();
            for (let i = 0; i < allProductLineItems.size(); i++) {
                if(allProductLineItems[i].productID === donatingProductID) {
                    allProductLineItems[i].custom.firstName = donatorFirstName;
                    allProductLineItems[i].custom.amount = donatedAmount;
                    allProductLineItems[i].custom.lastName = donatorLastName;
                    allProductLineItems[i].custom.emailAddress = donatorEmailAddress;
                } else {
                    return new Status(Status.OK);
                }
            }
            Transaction.commit();
        } else {
            return new Status(Status.OK);
        }
    } catch (e) {
        Logger.error('Error occured in the donationproductInBasket.js {0}', e.message);
    }
};

module.exports.donationProductInBasketDetails = donationProductInBasketDetails;
