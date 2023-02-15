'use strict';

/**
 * 1.Create a organization prefernce 'currencyConverterJSON' of type Text.
 * Below is the sample value of this preference.
 * [{
        "source-price-book-id": "usd-m-list-prices",
        "target-price-book-id": "inr-m-list-prices",
        "exchange-rate": 75.6,
        "currency": "INR"
    },
    {
        "source-price-book-id": "usd-m-sale-prices",
        "target-price-book-id": "inr-m-sale-prices",
        "exchange-rate": 75.6,
        "currency": "INR"
    }
 * ]
 * 2. Generate new price books based on above preference in Impex/src/pricebooks location.
 * 3. Import generated price books into BM using job.
 * 4. Enable hi_IN locale in BM & Update countries.json to have India locale and INR currency.
 */

var System = require('dw/system/System');
var ProductMgr = require('dw/catalog/ProductMgr');
var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var XMLStreamWriter = require('dw/io/XMLStreamWriter');

var listPriceBookCurrencyInINR = function () {
    var orgPrefs = System.getPreferences();
    var myOrgPrefValue = orgPrefs.getCustom().CurrencyConverterJSON;
    var myOrgPrefValueObject = JSON.parse(myOrgPrefValue);
    var allProducts = ProductMgr.queryAllSiteProducts();

    var usdListPriceBookID = myOrgPrefValueObject[0].source_price_book_id;
    var exchangeRate = myOrgPrefValueObject[0].exchange_rate;
    var targetPriceBookID = myOrgPrefValueObject[0].target_price_book_id;
    var targetCurrency = myOrgPrefValueObject[0].currency;

    var createFolder = new File(File.IMPEX + File.SEPARATOR + 'src' + File.SEPARATOR + 'PriceBooks');
    if (!createFolder.exists()) {
        createFolder.mkdir();
    }
    var listPriceBookFile = new File(File.IMPEX + File.SEPARATOR + 'src' + File.SEPARATOR + 'PriceBooks' +
        File.SEPARATOR + 'INRListPriceBook.xml');
    if (!listPriceBookFile) {
        listPriceBookFile.createNewFile();
    }
    var fileWriter = new FileWriter(listPriceBookFile, 'UTF-8');
    var xsw = new XMLStreamWriter(fileWriter);
    xsw.writeStartDocument();
    xsw.writeStartElement('pricebooks');
    xsw.writeAttribute('xmlns', 'http://www.demandware.com/xml/impex/pricebook/2006-10-31');
    xsw.writeStartElement('pricebook');
    xsw.writeStartElement('header');
    xsw.writeAttribute('pricebook-id', targetPriceBookID);
    xsw.writeStartElement('currency');
    xsw.writeCharacters(targetCurrency);
    xsw.writeEndElement();
    xsw.writeStartElement('display-name');
    xsw.writeAttribute('xml:lang', 'x-default');
    xsw.writeCharacters('List Prices');
    xsw.writeEndElement();
    xsw.writeStartElement('online-flag');
    xsw.writeCharacters('true');
    xsw.writeEndElement();
    xsw.writeEndElement();
    xsw.writeStartElement('price-tables');

    while (allProducts.hasNext()) {
        var eachProduct = allProducts.next();
        var individualProductID = eachProduct.ID;
        var individualProduct = ProductMgr.getProduct(individualProductID);
        var listPriceOfProduct = individualProduct.priceModel.getPriceBookPrice(usdListPriceBookID);
        if (listPriceOfProduct.isAvailable()) {
            var listPriceOfProductINR = listPriceOfProduct * exchangeRate;
            xsw.writeStartElement('price-table');
            xsw.writeAttribute('product-id', individualProductID);
            xsw.writeStartElement('amount');
            xsw.writeAttribute('quantity', '1');
            xsw.writeCharacters(listPriceOfProductINR);
            xsw.writeEndElement();
            xsw.writeEndElement();
        }
    }
    xsw.writeEndElement();
    xsw.writeEndElement();
    xsw.writeEndDocument();
    xsw.flush();
    xsw.close();
};

var salePriceBookCurrencyInINR = function () {
    var orgPrefs = System.getPreferences();
    var myOrgPrefValue = orgPrefs.getCustom().CurrencyConverterJSON;
    var myOrgPrefValueObject = JSON.parse(myOrgPrefValue);
    var allProducts = ProductMgr.queryAllSiteProducts();

    var usdSalePriceBookID = myOrgPrefValueObject[1].source_price_book_id;
    var targetListPriceBookID = myOrgPrefValueObject[0].target_price_book_id;
    var exchangeRate = myOrgPrefValueObject[1].exchange_rate;
    var targetPriceBookID = myOrgPrefValueObject[1].target_price_book_id;
    var targetCurrency = myOrgPrefValueObject[1].currency;

    var createFolder = new File(File.IMPEX + File.SEPARATOR + 'src' + File.SEPARATOR + 'PriceBooks');
    if (!createFolder.exists()) {
        createFolder.mkdir();
    }
    var salePriceBookFile = new File(File.IMPEX + File.SEPARATOR + 'src' + File.SEPARATOR + 'PriceBooks' +
        File.SEPARATOR + 'INRSalePriceBook.xml');
    if (!salePriceBookFile) {
        salePriceBookFile.createNewFile();
    }
    var fileWriter = new FileWriter(salePriceBookFile, 'UTF-8');
    var xsw = new XMLStreamWriter(fileWriter);
    xsw.writeStartDocument();
    xsw.writeStartElement('pricebooks');
    xsw.writeAttribute('xmlns', 'http://www.demandware.com/xml/impex/pricebook/2006-10-31');
    xsw.writeStartElement('pricebook');
    xsw.writeStartElement('header');
    xsw.writeAttribute('pricebook-id', targetPriceBookID);
    xsw.writeStartElement('currency');
    xsw.writeCharacters(targetCurrency);
    xsw.writeEndElement();
    xsw.writeStartElement('display-name');
    xsw.writeAttribute('xml:lang', 'x-default');
    xsw.writeCharacters('Sale Prices');
    xsw.writeEndElement();
    xsw.writeStartElement('online-flag');
    xsw.writeCharacters('true');
    xsw.writeEndElement();
    xsw.writeStartElement('parent');
    xsw.writeCharacters(targetListPriceBookID);
    xsw.writeEndElement();
    xsw.writeEndElement();
    xsw.writeStartElement('price-tables');

    while (allProducts.hasNext()) {
        var eachProduct = allProducts.next();
        var individualProductID = eachProduct.ID;
        var individualProduct = ProductMgr.getProduct(individualProductID);
        var salePriceOfProduct = individualProduct.priceModel.getPriceBookPrice(usdSalePriceBookID);
        if (salePriceOfProduct.isAvailable()) {
            var salePriceOfProductINR = salePriceOfProduct * exchangeRate;
            xsw.writeStartElement('price-table');
            xsw.writeAttribute('product-id', individualProductID);
            xsw.writeStartElement('amount');
            xsw.writeAttribute('quantity', '1');
            xsw.writeCharacters(salePriceOfProductINR);
            xsw.writeEndElement();
            xsw.writeEndElement();
        }
    }
    xsw.writeEndElement();
    xsw.writeEndElement();
    xsw.writeEndDocument();
    xsw.flush();
    xsw.close();
};

module.exports.listPriceBookCurrencyInINR = listPriceBookCurrencyInINR;
module.exports.salePriceBookCurrencyInINR = salePriceBookCurrencyInINR;
