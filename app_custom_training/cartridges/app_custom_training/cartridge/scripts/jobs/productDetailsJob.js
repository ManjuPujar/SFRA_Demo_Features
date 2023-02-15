'use strict';

var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var CSVStreamWriter = require('dw/io/CSVStreamWriter');
var ProductMgr = require('dw/catalog/ProductMgr');
var Logger = require('dw/system/Logger');

var productDetails = function () {
    var createFolder = new File(File.IMPEX + File.SEPARATOR + 'src' + File.SEPARATOR + 'Google');
    /**
     * Creating a folder with name google if it doesn't exists.
     */
    if (!createFolder.exists()) {
        createFolder.mkdir();
    }
    /**
     * Creating a file with name productsDetailsFile if it doesn't exists.
     */
    var file = new File(File.IMPEX + File.SEPARATOR + 'src' + File.SEPARATOR + 'Google' +
        File.SEPARATOR + 'productsDetailsFile.csv');
    if (!file.exists()) {
        file.createNewFile();
    }
    var fileWriter = new FileWriter(file);
    var csvWriter = new CSVStreamWriter(fileWriter);
    csvWriter.writeNext('ID', 'Name', 'ATS', 'Price');
    /**
     * allproducts variable contains all the products of the site in the form of iterator.
     */
    var allProducts = ProductMgr.queryAllSiteProducts();
    var inventoryATS;
    try {
        while (allProducts.hasNext()) {
            var productObject = allProducts.next();
            if (productObject.availabilityModel.inventoryRecord) {
                inventoryATS = productObject.availabilityModel.inventoryRecord.ATS.value;
            } else {
                inventoryATS = 'NA';
            }
            csvWriter.writeNext(productObject.ID, productObject.name, inventoryATS, productObject.priceModel.price);
        }
        fileWriter.flush();
        fileWriter.close();
    } catch (e) {
        Logger.error('Error in the controller productDetailsJob.js {0}', e.message);
    }
};

module.exports.productDetails = productDetails;
