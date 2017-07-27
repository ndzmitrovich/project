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
                this.categories = {};
                this.date = new Date();
            },

            setupEvents: function () {
                radio.on('auth/changed', this.changeAuth.bind(this));
                radio.on('db/loadUserCharges', this.addUserCharges.bind(this));
                radio.on('ui/currentMonthChanged', this.updateCurrentMonth.bind(this));
                radio.on('db/loadCategories', this.addCategories.bind(this));
                this.el.addEventListener('click', this.clickHandler.bind(this));

            },

            render: function () {
                var user = fb.getCurrentUser();
                var categoryObjects = this.getActiveCategoryObjects();
                this.el.innerHTML = this.template({
                    user: user,
                    categoryObjects: categoryObjects,
                    totalSum: this.getTotalSum(categoryObjects)
                });

            },

            addCategories: function (newCategories) {
                this.categories = {};
                for (var i = 0; i < newCategories.length; i++) {
                    this.categories[newCategories[i].code] = newCategories[i];
                }
                this.render();
            },

            getTotalSum: function(categoryObjects){
                var sum = 0;
                for(var i=0; i < categoryObjects.length;i++){
                    sum += categoryObjects[i].sum;
                }
                return sum;
            },

            getActiveCategoryObjects: function () {
                var firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
                var lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
                var categoryObjects = [];
                var categorySums = this.getCategorySumsForDatePeriod(this.charges, firstDay, lastDay);
                var categoryCodes = Object.keys(categorySums);

                for (var i = 0; i < categoryCodes.length; i++) {
                    var categoryCode = categoryCodes[i];
                    var categoryDescription = this.categories[categoryCode];
                    var categoryObject = {
                        name: categoryDescription != null ? categoryDescription.name : "",
                        code: categoryCode,
                        sum: categorySums[categoryCode]
                    };
                    categoryObjects.push(categoryObject);
                }

                return categoryObjects;
            },

            getCategorySumsForDatePeriod: function (allcharges, firstDay, lastDay) {
                var categorySums = {};
                for (var i = 0; i < allcharges.length; i++) {
                    var charge = allcharges[i];
                    var chargeDate = new Date(Date.parse(charge.date));
                    if (chargeDate >= firstDay && chargeDate <= lastDay) {
                        if (!categorySums[charge.categoryCode]) {
                            categorySums[charge.categoryCode] = 0;
                        }
                        categorySums[charge.categoryCode] = categorySums[charge.categoryCode] + charge.value;
                    }
                }

                return categorySums;
            },

            changeAuth: function (user) {
                this.render();
            },

            addUserCharges: function (charges) {
                this.charges = charges;
                this.render();
            },

            clickHandler: function (e) {
            },

            updateCurrentMonth: function (date) {
                this.date = date;
                this.render();
            }

        };
    });