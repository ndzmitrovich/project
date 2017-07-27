requirejs.config({
    baseUrl: 'js/app',
    paths: {
        underscore: '../lib/underscore',
        text: '../lib/text',
        firebase: 'https://www.gstatic.com/firebasejs/4.1.1/firebase',
        jquery: '../lib/jquery.min',
        bootstrap: '../lib/bootstrap.min',
        datepicker: '../lib/bootstrap-datepicker.min',
        datepicker_ru: '../lib/bootstrap-datepicker.ru.min'
    },
    shim: {
        firebase: {
            exports: 'firebase'
        }
    },
    config: {
        fb: {
            apiKey: "AIzaSyAyOPIETzpkOyZ2DEiH3-lC0pc8OzzlTVk",
            authDomain: "project-b3322.firebaseapp.com",
            databaseURL: "https://project-b3322.firebaseio.com",
            projectId: "project-b3322",
            storageBucket: "project-b3322.appspot.com",
            messagingSenderId: "761802088300"
        }
    }
});

requirejs(['app'], function (app) {
    app.init();
});
