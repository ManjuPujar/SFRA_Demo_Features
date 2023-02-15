'use strict';

module.exports = {
    notifyProductAvailabilityFormToggle: function () {
        $('.toggle-notification-form .btn').on('click', function () {
            $('.notify-Product-availability').toggle();
        });
    }
};
