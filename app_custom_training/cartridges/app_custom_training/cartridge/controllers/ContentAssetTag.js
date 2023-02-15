'use strict';

/**
 * @namespace  controllers/ContentAssetTag
 * Create a content asset and Create a Controller to render this content asset
 * by Using iscontentAsset tag.
 */

var server = require('server');

server.get('ContentAssetTag', function (req, res, next) {
    res.render('Training/contentAssetTag');
    next();
});

module.exports = server.exports();
