define(['fb', 'radio', 'modules/authorization', 'modules/mainBlock','modules/controlBlock',
        'modules/addChargeBlock','jquery', 'bootstrap','datepicker'],
    function (fb, radio, authorization, main, control, addCharge) {
        return {
            init: function () {
                fb.init();
                authorization.init();
                main.init();
                control.init();
                addCharge.init();
            }
        };
    });