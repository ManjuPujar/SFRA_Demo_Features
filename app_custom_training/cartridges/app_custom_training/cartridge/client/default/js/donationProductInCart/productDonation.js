'use strict';

/**
 * Updates the Mini-Cart quantity value after the customer has pressed the "Add to Cart" button
 * @param {string} response - ajax response from clicking the add to cart button
 */
 function handlePostCartAdd(response) {
    $('.minicart').trigger('count:update', response);
    var messageType = response.error ? 'alert-danger' : 'alert-success';
    // show add to cart toast
    if (response.newBonusDiscountLineItem
        && Object.keys(response.newBonusDiscountLineItem).length !== 0) {
        chooseBonusProducts(response.newBonusDiscountLineItem);
    } else {
        if ($('.add-to-cart-messages').length === 0) {
            $('body').append(
                '<div class="add-to-cart-messages"></div>'
            );
        }

        $('.add-to-cart-messages').append(
            '<div class="alert ' + messageType + ' add-to-basket-alert text-center" role="alert">'
            + response.message
            + '</div>'
        );

        setTimeout(function () {
            $('.add-to-basket-alert').remove();
        }, 5000);
    }
}

var donationProductAddToCart = function () {
    $('.donation-main-class').submit(function(e) {
        var donationForm = $(this);
        e.preventDefault();
        donationForm.spinner().start();
        var addTocartUrl = donationForm.attr('action');
        var form = {
            pid: $('.product-id-input').val(),
            quantity: $('.product-quantity-input').val(),
            amount: $('#donated-product-amount').val(),
            emailAddress: $('#donator-email-address').val(),
            firstName: $('#donator-first-name').val(),
            lastName: $('#donator-last-name').val()
        };
        $.ajax({
            url: addTocartUrl,
            type: 'POST',
            dataType: 'Json',
            data: form,
            success: function (responseOfAddtoCart) {
                handlePostCartAdd(responseOfAddtoCart);
                donationForm.spinner().stop();
            },
            error: function () {
                donationForm.spinner().stop();
            }
        });
    });
}

module.exports = donationProductAddToCart;
