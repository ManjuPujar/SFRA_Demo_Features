'use strict';

/**
 *
 * @module  controllers/AliasCheck
 * Create a controller and create a Pipeline alias for the same.
 * Include this controller remotely in different ISML and document
 * the result after calling the main controller.
 */

var server = require('server');

server.get('Alias', function (req, res, next) {
    res.render('Training/aliasCheck');
    next();
});

server.get('AliasIncluded', function (req, res, next) {
    res.render('Training/aliasInclude');
    next();
});

module.exports = server.exports();
