'use strict';

/**
* @module cartridge/models/MainModule
*/

var getOrderData = function () {
    var orders = customer.orderHistory.getOrders();
    var orderlist = orders.asList();
    return orderlist;
};

module.exports = getOrderData();
