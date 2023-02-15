'use strict';

var Site = require('dw/system/Site');
var URLUtils = require('dw/web/URLUtils');
var URLAction = require('dw/web/URLAction');
var Status = require('dw/system/Status');

var onRequest = function () {
    var currentLocale = request.locale;
    var allCookies = request.getHttpCookies();
    var allLocales = Site.getCurrent().getAllowedLocales();
    var numberOfCookies = allCookies.getCookieCount();
    var countryCode = request.geolocation.countryCode;
    var enlocale = 'en_' + countryCode;
    var siteID = Site.getCurrent().getID();
    var boolean;
    if (currentLocale === enlocale) {
        return new Status(Status.OK);
    }
    for (var i = 0; i < numberOfCookies; i++) {
        if (allCookies[i].value === countryCode) {
            for (var j = 0; j < allLocales.length; j++) {
                if (allLocales[j] === enlocale) {
                    boolean = true;
                } else {
                    boolean = false;
                }
            }
        } else {
            boolean = false;
        }
    }
    if (boolean) {
        var urlActionINen = new URLAction('Home-Show', siteID, enlocale);
        var url = URLUtils.http(urlActionINen);
        response.redirect(url);
    }
    return new Status(Status.OK);
};

var onSession = function () {
    var currentLocale = request.locale;
    var allCookies = request.getHttpCookies();
    var allLocales = Site.getCurrent().getAllowedLocales();
    var numberOfCookies = allCookies.getCookieCount();
    var countryCode = request.geolocation.countryCode;
    var enlocale = 'en_' + countryCode;
    var siteID = Site.getCurrent().getID();
    var boolean;
    if (currentLocale === enlocale) {
        return new Status(Status.OK);
    }
    for (var i = 0; i < numberOfCookies; i++) {
        if (allCookies[i].value === countryCode) {
            for (var j = 0; j < allLocales.length; j++) {
                if (allLocales[j] === enlocale) {
                    boolean = true;
                } else {
                    boolean = false;
                }
            }
        } else {
            boolean = false;
        }
    }
    if (boolean) {
        var urlActionINen = new URLAction('Home-Show', siteID, enlocale);
        var url = URLUtils.http(urlActionINen);
        response.redirect(url);
    }
    return new Status(Status.OK);
};

module.exports.onRequest = onRequest;
module.exports.onSession = onSession;
