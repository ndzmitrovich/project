define(['underscore', 'radio', 'fb', 'text!templates/authorization.html'],
    function (_, radio, fb, authTemplate) {
        return {
            init: function () {
                this.template = _.template(authTemplate);
                this.el = document.querySelector('.auth');

                this.render();
                this.setupEvents();
            },

            render: function () {
                var user = arguments[0] || fb.getCurrentUser();
                this.el.innerHTML = this.template({
                    user: user
                });
            },

            setupEvents: function () {
                radio.on('auth/changed', this.changeAuth.bind(this));

                this.el.addEventListener('click', function (e) {

                    if (e.target.classList.contains('sign-in')) {
                        fb.signInGoogle();
                    }
                    if (e.target.classList.contains('sign-out') ) {
                        fb.signOut();
                    }
                });
            },

            changeAuth: function (user) {
                this.render(user);
            }
        };
    });
