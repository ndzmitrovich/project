define(['fb', 'radio', 'modules/localization',  'modules/authorization', 'modules/mainBlock', 'modules/controlBlock',
        'modules/addChargeBlock','jquery', 'bootstrap', 'datepicker'],
    function (fb, radio, localization, authorization, main, control, addCharge) {
        return {
            init: function () {

                fb.init();
                localization.init();
                authorization.init();
                main.init();
                control.init();
                addCharge.init();
            }
        };
    });