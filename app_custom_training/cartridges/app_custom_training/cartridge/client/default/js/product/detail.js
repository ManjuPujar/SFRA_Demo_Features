'use strict';
var custombase = require('./base');
var detail = require('base/product/detail');

var exportDetails = $.extend({}, custombase, detail, {
    addToCart: custombase.addToCart,
    availability: custombase.availability,
    focusChooseBonusProductModal: custombase.focusChooseBonusProductModal
});

module.exports = exportDetails;