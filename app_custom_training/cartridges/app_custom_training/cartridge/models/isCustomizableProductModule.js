'use strict';

var Transaction = require('dw/system/Transaction');
var Logger = require('dw/system/Logger');

var isCustomizableProductData = function (basket, req) {
    var currentBasket = basket;
    var frontName = req.form.frontName;
    var backName = req.form.backName;
    var isCustomizableCheckBox = req.form.isCustomizableProductCheckBox;
    if (isCustomizableCheckBox === 'on') {
        isCustomizableCheckBox = true;
    } else {
        isCustomizableCheckBox = false;
    }
    var productlineitem = currentBasket.allProductLineItems;
    try {
        for (let i = 0; i < productlineitem.length; i++) {
            if (productlineitem[i].custom.isCustomizableCheckBoxValue === true) {
                Transaction.wrap(function () {
                    currentBasket.allProductLineItems[i].custom.frontName = frontName;
                    currentBasket.allProductLineItems[i].custom.backName = backName;
                    currentBasket.allProductLineItems[i].custom.isCustomizableCheckBoxValue = isCustomizableCheckBox;
                    currentBasket.shipments[i].custom.hasCustomziation = isCustomizableCheckBox;
                    if (currentBasket.shipments[i].custom.hasCustomziation) {
                        currentBasket.custom.hasCustomziation = isCustomizableCheckBox;
                    }
                });
            } else {
                Transaction.wrap(function () {
                    currentBasket.allProductLineItems[i].custom.isCustomizableCheckBoxValue = isCustomizableCheckBox;
                    currentBasket.shipments[i].custom.hasCustomziation = isCustomizableCheckBox;
                });
            }
        }
    } catch (e) {
        Logger.error('Error occured while storing isCustomizable data {0}', e.message);
    }
};

module.exports.isCustomizableProductData = isCustomizableProductData;
