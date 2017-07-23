define(['underscore', 'radio', 'fb', 'text!templates/mainBlock.html'],
    function (_, radio, fb, main) {
        return {
            init: function () {
                this.template = _.template(main);
                this.el = document.querySelector('.main-block');

                this.setupVariables();
                this.setupEvents();
                this.render();

            },

            setupVariables: function () {
                this.charges = [];
                this.categories = [];
            },

            setupEvents: function () {
                radio.on('auth/changed', this.changeAuth.bind(this));
                radio.on('db/loadUserCharges', this.addUserCharges.bind(this));
                this.el.addEventListener('click', this.clickHandler.bind(this));

            },

            render: function () {
                var user = arguments[1] || fb.getCurrentUser();

                this.el.innerHTML = this.template({
                    user: user,
                    charges: this.charges,
                    categories: this.categories

                });

            },

            changeAuth: function (user) {
                this.render(this.tasks, user);
            },

            addUserCharges: function (charges) {
                this.charges = charges;
            },

            clickHandler: function (e) {

            }

        };
    });