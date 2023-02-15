'use strict';

var server = require('server');
var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');
var Resource = require('dw/web/Resource');
var URLUtils = require('dw/web/URLUtils');
var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');

server.extend(module.superModule);
server.prepend('Show', userLoggedIn.validateLoggedIn);

server.replace('AddProduct', function (req, res, next) {
    var list = productListHelper.getCurrentOrNewList(req.currentCustomer.raw, {
        type: 10
    });
    var pid = req.form.pid;
    var optionId = req.form.optionId || null;
    var optionVal = req.form.optionVal || null;
    if (!customer.isAuthenticated()) {
        res.json({
            loginPageUrl: URLUtils.http('Login-Show', 'pid', pid).toString()
        });
        return next();
    }
    var config = {
        qty: 1,
        optionId: optionId,
        optionValue: optionVal,
        req: req,
        type: 10
    };
    var errMsg = productListHelper.itemExists(list, pid, config) ? Resource.msg('wishlist.addtowishlist.exist.msg', 'wishlist', null) :
        Resource.msg('wishlist.addtowishlist.failure.msg', 'wishlist', null);

    var success = productListHelper.addItem(list, pid, config);
    if (success) {
        res.json({
            success: true,
            pid: pid,
            msg: Resource.msg('wishlist.addtowishlist.success.msg', 'wishlist', null)
        });
    } else {
        res.json({
            error: true,
            pid: pid,
            msg: errMsg
        });
    }
    next();
    return null;
});

module.exports = server.exports();
