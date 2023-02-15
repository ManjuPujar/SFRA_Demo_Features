'use strict';

/**
* @module cartridge/models/SitePreferenceGroupProduct
*/

var ArrayList = require('dw/util/ArrayList');
var ProductMgr = require('dw/catalog/ProductMgr');
var Site = require('dw/system/Site');

var productList = function () {
    var arrayList = new ArrayList();
    var currentSite = Site.getCurrent();
    var preferenceGroup = currentSite.getCustomPreferenceValue('ProductIDS');
    for (var i = 0; i < preferenceGroup.length; i++) {
        arrayList.add(ProductMgr.getProduct(preferenceGroup[i]));
    }
    return arrayList;
};

var customPrefProduct = function () {
    var currentSite = Site.getCurrent();
    var productID = currentSite.getCustomPreferenceValue('DpIDs');
    return productID;
};

module.exports = {
    productList: productList,
    customPrefProduct: customPrefProduct
};
