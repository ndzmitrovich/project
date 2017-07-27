define(['underscore', 'radio', 'fb', 'jquery', 'text!templates/controlBlock.html'],
    function (_, radio, fb, $, controlTemplate) {
        return {
            init: function () {
                this.template = _.template(controlTemplate);
                this.el = document.querySelector('.control-block');

                this.setupVariables();
                this.setupEvents();
                this.render();


            },

            setupVariables: function () {
            },

            setupEvents: function () {
                radio.on('auth/changed', this.changeAuth.bind(this));
                this.el.addEventListener('click', this.clickHandler.bind(this));

            },

            render: function () {
                var user = fb.getCurrentUser();

                this.el.innerHTML = this.template({
                    user: user,
                    categories: this.categories
                });
                $(".month-calendar").datepicker({
                    format: "mm-yyyy",
                    startView: "months",
                    minViewMode: "months",
                    language: "ru"
                });

               $(".month-calendar").on('changeDate', this.datePickerHandler.bind(this));

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

            datePickerHandler: function (e) {
                radio.trigger('ui/currentMonthChanged', $(e.target).datepicker('getDate'));
            }

        };
    });