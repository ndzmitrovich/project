define(['underscore', 'radio', 'fb', 'text!templates/controlBlock.html'],
    function (_, radio, fb, controlTemplate) {
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
                var user = arguments[1] || fb.getCurrentUser();

                this.el.innerHTML = this.template({
                    user: user,
                    categories: this.categories
                });
                $(".month-calendar").datepicker({
                    format: "mm-yyyy",
                    startView: "months",
                    minViewMode: "months"
                });
                $(".month-calendar").on('changeDate', function () {
                    $('.monthValue').val(
                        $('#month-calendar').datepicker('getFormattedDate')
                    );
                    radio.trigger('ui/currentMonthChanged', $('#month-calendar').datepicker('getDate'));
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

        };
    });