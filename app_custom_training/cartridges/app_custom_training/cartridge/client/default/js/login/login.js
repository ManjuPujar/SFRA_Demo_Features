'use strict';

var baseLayer = require('base/login/login');
var formValidation = require('base/components/formValidation');

baseLayer.login = function () {
    $('form.login').submit(function (e) {
        var form = $(this);
        e.preventDefault();
        var url = form.attr('action');
        form.spinner().start();
        $('form.login').trigger('login:submit', e);
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: form.serialize(),
            success: function (data) {
                form.spinner().stop();
                if (!data.success) {
                    formValidation(form, data);
                    $('form.login').trigger('login:error', data);
                } else {
                    // getting value from loginForm through id selector
                    var wishListUrl = $('#login-form-wishlist-url').val();
                    var wishListPid = $('#login-form-wishlist-pid').val();
                    $.ajax({
                        url: wishListUrl, // wishListUrl is Wishlist-AddProduct URL
                        type: 'post',
                        dataType: 'json',
                        data: {
                            pid: wishListPid
                        },
                        success: function (response) {
                            if (response.loginPageUrl) {
                                window.location.href = response.loginPageUrl;
                            }
                        },
                        error: function () {
                            // alert('error occured-not able to add product to wishlist in login.js ajax');
                        }
                    });
                    $('form.login').trigger('login:success', data);
                    if (wishListPid !== 'null') {
                        window.history.back();
                    } else {
                        location.href = data.redirectUrl;
                    }
                }
            },
            error: function (data) {
                if (data.responseJSON.redirectUrl) {
                    window.location.href = data.responseJSON.redirectUrl;
                } else {
                    $('form.login').trigger('login:error', data);
                    form.spinner().stop();
                }
            }
        });
        return false;
    });
};

module.exports = baseLayer;
