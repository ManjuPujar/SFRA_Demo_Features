'use strict';

module.exports = {
    isCustomizableOptionforProduct: function () {
        $('#isCustomizableProduct').on('click', function () {
            $('.isCustomizableProductForm').toggle();
        });
    }
};
