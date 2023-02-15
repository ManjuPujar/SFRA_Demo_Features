'use strict';

module.exports = {
    emailSubscriptionAjax: function () {
        $('.form-main-class').submit(function (e) {
            var emailForm = $(this);
            e.preventDefault();
            var url = emailForm.attr('action');
            emailForm.spinner().start();
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: emailForm.serialize(),
                success: function (Info) {
                    emailForm.spinner().stop();
                    var message = '<h1>' + Info.msg + '</h1>';
                    $('.keep-form-message').html(message);
                },
                error: function (data) {
                    emailForm.spinner().stop();
                    if (data.responseJSON.redirectUrl) {
                        window.location.href = data.responseJSON.redirectUrl;
                    }
                }
            });
        });
    }
};
