'use strict';

/**
* @namespace  controllers/ProductDeatilsRestWS
* Create a Job for generating CSV file which will contains Product Details like Product ID, Name, ATS & Price.
* This job has to execute the Script file which Contains Webservice REST API which will further invoke a
* Controller whose Output will be of JSON type & the CSV file has to be saved in a folder named Google
* in the impex location generated programmatically.
*/

var server = require('server');

var ProductMgr = require('dw/catalog/ProductMgr');
var Logger = require('dw/system/Logger');

server.post('Web', function (req, res, next) {
    var body = req.body;
    var bodyObject = JSON.parse(body);
    var productID = bodyObject.pid;
    var product;
    try {
        product = ProductMgr.getProduct(productID);
    } catch (e) {
        Logger.error('Error while fetching product from productID {0}', e.message);
    }
    res.json({
        ID: product.ID,
        Name: product.name,
        Price: product.priceModel.price.value,
        ATS: product.availabilityModel.inventoryRecord ? product.availabilityModel.inventoryRecord.ATS.value : 'NA'
    });
    next();
});

module.exports = server.exports();
