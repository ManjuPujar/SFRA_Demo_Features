'use strict';

var URLUtils = require('dw/web/URLUtils');
var URLAction = require('dw/web/URLAction');
var Status = require('dw/system/Status');
var Site = require('dw/system/Site');
var Locale = require('dw/util/Locale');

var onRequest = function () {
    var currentLocale = request.locale;
    if (currentLocale === 'en_IN') {
        return new Status(Status.OK);
    }
    var cookie = request.httpCookies.countryCode;
    var localeExists;
    if (cookie) {
        var cookieLocale = 'en_' + cookie.value;
        localeExists = Locale.getLocale(cookieLocale);
    } else {
        return new Status(Status.OK);
    }
    if (localeExists) {
        var clickStream = session.getClickStream();
        var urlAction = new URLAction(clickStream.last.pipelineName, Site.getCurrent().ID, localeExists);
        var url = URLUtils.https(urlAction);
        if (clickStream.last.queryString) {
            url = url + '?' + clickStream.last.queryString;
        }
        response.redirect(url);
    }
    return new Status(Status.OK);
};

var onSession = function () {
    var currentLocale = request.locale;
    if (currentLocale === 'en_IN') {
        return new Status(Status.OK);
    }
    var cookie = request.httpCookies.countryCode;
    var localeExists;
    if (cookie) {
        var cookieLocale = 'en_' + cookie.value;
        localeExists = Locale.getLocale(cookieLocale);
    } else {
        return new Status(Status.OK);
    }
    if (localeExists) {
        var clickStream = session.getClickStream();
        var urlAction = new URLAction(clickStream.last.pipelineName, Site.getCurrent().ID, localeExists);
        var url = URLUtils.https(urlAction);
        if (clickStream.last.queryString) {
            url = url + '?' + clickStream.last.queryString;
        }
        response.redirect(url);
    }
    return new Status(Status.OK);
};

module.exports.onRequest = onRequest;
module.exports.onSession = onSession;
