'use strict';

module.exports = {
    giftCertificationCode: function () {
        $('#gift-card-balance-check').on('click', function (e) {
            var giftCardForm = $(this);
            e.preventDefault();
            var url = giftCardForm.data('url');
            var giftCardCode = $('#gift-coupon-code-input').val();
            giftCardForm.spinner().start();
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: {
                    giftCardCode: giftCardCode
                },
                success: function (Info) {
                    giftCardForm.spinner().stop();
                    var message = '<h5>' + Info.giftCardCodeBalance + '</h5>';
                    $('#for-replacing-input-msg').html(message);
                    $('#for-replacing-input-msg').css('color', 'green');
                },
                error: function (data) {
                    giftCardForm.spinner().stop();
                    alert('Enter a Valid Gift Certification');
                }
            });
        });
    },
    giftCertificationCodeApply: function () {
        $('#gift-card-code-apply').on('click', function (e) {
            var giftCardForm = $(this);
            e.preventDefault();
            var url = giftCardForm.data('url');
            var giftcardCode = $('#gift-coupon-code-input').val();
            giftCardForm.spinner().start();
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: {
                    giftcardCode: giftcardCode
                },
                success: function (giftCardResponse) {
                    giftCardForm.spinner().stop();
                    if(giftCardResponse.statusCode === 1) {
                        var redeemingMessage = '<h6>' + giftCardResponse.Displaymessage + '</h6>';
                        $('#for-replacing-input-msg').html(redeemingMessage);
                        $('#for-replacing-input-msg').css('color', 'red');
                    } else {
                        var redeemingMessage = '<h6>' + giftCardResponse.Displaymessage + '</h6>';
                        $('#for-replacing-input-msg').html(redeemingMessage);
                        $('#for-replacing-input-msg').css('color', 'green');
                        $('.payment-information').data('payment-method-id', 'GIFT_CERTIFICATE');
                    }
                    if (giftCardResponse.boolean === true) {
                        $('.for-gift-card-hide').hide();
                    } else {
                        $('.for-gift-card-hide').show();
                    }
                    $('.remove-button-giftcertification').removeClass('d-none');
                },
                error: function (error) {
                    giftCardForm.spinner().stop();
                    alert('Error Occured in the client side file giftcertificationCode.js')
                }
            });
        });
    },
    giftCertificationRemove: function () {
        $('.remove-button-giftcertification').on('click', function (e) {
            e.preventDefault();
            var giftCardForm = $(this);
            var url = $(this).attr('href');
            var giftCertificationCode = $('#gift-coupon-code-input').val();
            document.getElementById('gift-coupon-code-input').value = '';
            giftCardForm.spinner().start();
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: {
                    giftCertificationCode: giftCertificationCode
                },
                success: function (urlResponse) {
                    giftCardForm.spinner().stop();
                    var deletedMsg = '<h6>' + urlResponse.deleteMsg + '</h6>';
                    $('#for-replacing-input-msg').html(deletedMsg);
                    $('#for-replacing-input-msg').css('color', 'green');
                    $('.remove-button-giftcertification').addClass('d-none');
                },
                error: function (error) {
                    giftCardForm.spinner().stop();
                    alert('Error Occured in the client side file giftcertificationCode.js while removing gift Code')
                }
            });
        });
    }
};
