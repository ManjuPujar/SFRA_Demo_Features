'use strict';

/**
 * productDeatilsCSVFileWS.js Script is Triggered by job in BM
 * @Calls the Controller ProductDeatilsRestWS by using REST webservice API's
 * @returns CSV file which contains Product ID, Name, Price & ATS.
 *
 */

var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var CSVStreamWriter = require('dw/io/CSVStreamWriter');
var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var ProductMgr = require('dw/catalog/ProductMgr');
var Logger = require('dw/system/Logger');

var productDetails = function () {
    var folder = new File(File.IMPEX + File.SEPARATOR + 'src' + File.SEPARATOR + 'WebServices');
    if (!folder.exists()) {
        folder.mkdir();
    }
    var file = new File(File.IMPEX + File.SEPARATOR + 'src' + File.SEPARATOR + 'WebServices' +
        File.SEPARATOR + 'ProductDetailsFile.csv');
    if (!file.exists()) {
        file.createNewFile();
    }
    var fileWriter = new FileWriter(file);
    var csvWriter = new CSVStreamWriter(fileWriter);
    csvWriter.writeNext('ID', 'Name', 'ATS', 'Price');
    var allProducts = ProductMgr.queryAllSiteProducts();
    try {
        while (allProducts.hasNext()) {
            var pID = allProducts.next().ID;
            var service = LocalServiceRegistry.createService('app_custom_training.http.productDetails.post', {
                createRequest: function (svc, params) {
                    var payload = {};
                    payload.pid = params.productId;
                    return JSON.stringify(payload);
                },
                parseResponse: function (svc, responseObject) {
                    return responseObject;
                }
            });
            var result = service.call({
                productId: pID
            });
            var outputObject = JSON.parse(result.object.text);
            csvWriter.writeNext(outputObject.ID, outputObject.Name, outputObject.ATS, outputObject.Price);
        }
        fileWriter.flush();
        fileWriter.close();
    } catch (e) {
        Logger.error('Error in the Script file productDeatilsCSVFileWS.js {0}', e.message);
    }
};

module.exports.productDetails = productDetails;
