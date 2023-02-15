'use strict';

/**
 * @namespace  controllers/ArrayProduct
 * Create an Arraylist and add the product objects in the ArrayList and also
 * by using IsLoop tag Display the Product Name each.
 * And also for the same template use IsDecorator tag.
 * Include an isml file within the other isml file.
 */

var server = require('server');

var ProductMgr = require('dw/catalog/ProductMgr');
var ArrayList = require('dw/util/ArrayList');

server.get('GetProduct', function (req, res, next) {
    var Product1 = ProductMgr.getProduct('P2603');
    var Product2 = ProductMgr.getProduct('P2604');
    var Product3 = ProductMgr.getProduct('P2605');
    var Product4 = ProductMgr.getProduct('P2606');
    var productArrayList = new ArrayList();
    productArrayList.add(Product1);
    productArrayList.add(Product2);
    productArrayList.add(Product3);
    productArrayList.add(Product4);
    res.render('Training/arrayProduct', {
        ArrayList: productArrayList
    });
    next();
});

module.exports = server.exports();
