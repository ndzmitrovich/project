define(['underscore', 'radio', 'fb', 'jquery', 'text!templates/mainBlock.html', 'text!templates/chargesBlock.html'],
    function (_, radio, fb, $, main, charges) {
        return {
            init: function () {
                this.mainTemplate = _.template(main);
                this.chargesTemplate = _.template(charges);
                this.el = document.querySelector('.main-block');

                this.setupVariables();
                this.setupEvents();
                this.render();

            },

            setupVariables: function () {
                this.charges = [];
                this.categories = {};
                this.categoryCharges = {};
                this.date = new Date();
                this.selectedCategory = null;
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

                if (this.selectedCategory) {
                    this.el.innerHTML = this.chargesTemplate({
                        charges: this.getChargesForActiveCategory(),
                        category: this.getActiveCategory()
                    });
                } else {
                    var categoryObjects = this.getActiveCategoryObjects();
                    this.el.innerHTML = this.mainTemplate({
                        user: user,
                        categoryObjects: categoryObjects,
                        totalSum: this.getTotalSum(categoryObjects)
                    });
                }


            },

            addCategories: function (newCategories) {
                this.categories = {};
                for (var i = 0; i < newCategories.length; i++) {
                    this.categories[newCategories[i].code] = newCategories[i];
                }
                this.render();
            },

            getTotalSum: function (categoryObjects) {
                var sum = 0;
                for (var i = 0; i < categoryObjects.length; i++) {
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

            getChargesForActiveCategory: function () {
                var firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
                var lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
                return this.getChargesForDatePeriod(this.categoryCharges[this.selectedCategory], firstDay, lastDay);
            },

            getActiveCategory: function () {
                return this.categories[this.selectedCategory];
            },


            getChargesForDatePeriod: function (allcharges, firstDay, lastDay) {
                var charges = [];
                for (var i = 0; i < allcharges.length; i++) {
                    var charge = allcharges[i];
                    var chargeDate = new Date(Date.parse(charge.date));
                    if (chargeDate >= firstDay && chargeDate <= lastDay) {
                        charges.push(charge);
                    }
                }
                return charges;
            },

            getCategorySumsForDatePeriod: function (allcharges, firstDay, lastDay) {
                var categorySums = {};
                var actualCharges = this.getChargesForDatePeriod(allcharges, firstDay, lastDay);
                for (var i = 0; i < actualCharges.length; i++) {
                    var charge = actualCharges[i];

                    if (!categorySums[charge.categoryCode]) {
                        categorySums[charge.categoryCode] = 0;
                    }
                    categorySums[charge.categoryCode] = categorySums[charge.categoryCode] + charge.value;

                }

                return categorySums;
            },

            changeAuth: function (user) {
                this.setupVariables();
                this.render();
            },

            addUserCharges: function (charges) {
                this.charges = charges;
                this.categoryCharges = [];
                for (var i = 0; i < charges.length; i++) {
                    if (!this.categoryCharges[charges[i].categoryCode]) {
                        this.categoryCharges[charges[i].categoryCode] = [];
                    }
                    this.categoryCharges[charges[i].categoryCode].push(charges[i]);
                }
                this.render();
            },

            clickHandler: function (e) {

                if ($(e.target).parents().hasClass('category-details')) {
                    this.selectedCategory = $(e.target).parents('.category-details')[0].id;
                    this.render();
                }

                if (e.target.classList.contains('close-category-detail')) {
                    this.selectedCategory = null;
                    this.render();
                }
            },

            updateCurrentMonth: function (date) {
                this.date = date;
                this.selectedCategory = null;
                this.render();
            }

        };
    });