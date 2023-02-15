'use strict';

/**
 * @namespace controllers/EditCookieRead
 * Create a cookie by Using edit this Cookie tool with name, redirect URL
 * with any URL as value.
 * Create a controller to read this Cookie value and pass the value to Isml
 * file.
 * Using <isredirect> redirect it to Url, 302 redirect.
 */

var server = require('server');

server.get('UrlCookie', function (req, res, next) {
    var readCookie = request.httpCookies.RedirectUrl.value;
    res.render('Training/editCookieRead', {
        cookieObject: readCookie
    });
    //	var readCookie = request.httpCookies['RedirectUrl'];
    //	if(readCookie){
    //	var readCookie1 = request.httpCookies['RedirectUrl'].value;
    //	res.render('Training/editCookieRead', {
    //	    cookieObject : readCookie1
    //	});
    //	} else{
    //		res.render('Training/createCookie');
    //	}
    next();
});

// Creating cookie using <iscookie> tag in isml file

server.get('CreateCookie', function (req, res, next) {
    res.render('Training/createCookie');
    next();
});

module.exports = server.exports();
