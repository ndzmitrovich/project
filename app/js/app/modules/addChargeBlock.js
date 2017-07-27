define(['underscore', 'radio', 'fb', 'jquery', 'text!templates/addChargeBlock.html'],
    function (_, radio, fb, $, addChargeTemplate) {
        return {
            init: function () {
                this.template = _.template(addChargeTemplate);
                this.el = document.querySelector('.modal-block');

                this.setupVariables();
                this.setupEvents();
                this.render();

            },

            setupVariables: function () {
                this.categories = [];
                this.date = new Date();
            },

            setupEvents: function () {
                radio.on('auth/changed', this.changeAuth.bind(this));
                radio.on('db/loadCategories', this.addCategories.bind(this));
                radio.on('ui/currentMonthChanged', this.updateCurrentMonth.bind(this));
                this.el.addEventListener('click', this.clickHandler.bind(this));

            },

            render: function () {
                var user =  fb.getCurrentUser();

                this.el.innerHTML = this.template({
                    user: user,
                    categories: this.categories

                });

            },

            changeAuth: function (user) {
                this.render();
            },

            addCategories: function (categories) {
                this.categories = categories;
                this.render();
            },

            clickHandler: function (e) {
                if (e.target.classList.contains('save-charge')) {
                    this.saveChargeInDb();
                }
            },

            updateCurrentMonth: function(date){
                this.date = date;
                this.render();
            },

            saveChargeInDb: function () {

                fb.saveCharge({
                    categoryCode: $("#chargeType").val(),
                    comment: $("#chargeСomment").val(),
                    value: parseFloat($("#chargeValue").val()),
                    date: $("#chargeСalendar").val()
                 });

            }

        };
    });