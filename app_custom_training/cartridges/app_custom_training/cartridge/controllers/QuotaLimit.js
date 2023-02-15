'use strict';

/**
* @namespace  controllers/QuotaLimit
* exceeding Quota Limit in ArrayList or collection
*/

var server = require('server');

var Arraylist = require('dw/util/ArrayList');
server.get('Exceed', function (req, res, next) {
    var arrayList = new Arraylist();
    for (var i = 0; i <= 20100; i++) {
        arrayList.add(i);
    }
    res.json();
    next();
});

module.exports = server.exports();
