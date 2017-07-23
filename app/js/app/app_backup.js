(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAyOPIETzpkOyZ2DEiH3-lC0pc8OzzlTVk",
        authDomain: "project-b3322.firebaseapp.com",
        databaseURL: "https://project-b3322.firebaseio.com",
        projectId: "project-b3322",
        storageBucket: "project-b3322.appspot.com",
        messagingSenderId: "761802088300"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    var uiConfig = {
        signInSuccessUrl: 'index.html',
        signInOptions: [
            // Указываем провайдеров для Firebase Аутентификации
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        // Здесь вы можете специфировать условия к использованию, которые будут показаны при виджете
        tosUrl: '<your-tos-url>'
    };
// Инициализирум FirebaseUI виджет
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
// Для начала методы мы подождем пока html полностью загрузиться
    ui.start('#firebaseui-auth-container', uiConfig);
    var currentUid = null;
    firebase.auth().onAuthStateChanged(function (user) {

        if (user) {
            $(".authorized_div").show();
            $(".not_authorized_div").hide();
        }

        if (user && user.uid !== currentUid) {

            $('#userModal').modal('hide');
            ui.reset();

            $('#firebaseui-auth-container').empty().append("<button class='btn btn-primary signout' >Выйти</button>");

            $(".signout").on("click", function () {

                $('#userModal').modal('hide');
                $('#firebaseui-auth-container').empty();
                firebase.auth().signOut().then(function () {

                }, function (error) {
                    console.error('Sign Out Error', error);
                });
            });
            currentUid = user.uid;
        } else if (currentUid !== null) {
            $(".authorized_div").hide();
            $(".not_authorized_div").show();
            ui.start('#firebaseui-auth-container', uiConfig);
            currentUid = null;
            console.log("no user signed in");
        }
    });
    $('#saveProduct').on('click', function () {
        writeUserCharge(currentUid, $("#chargeType").val(), $("#chargeValue").val(), $("#chargeСalendar").val());
    });

    function writeUserCharge(userId, categoryName, chargeValue, chargeDate) {
        var ref = database.ref('charges').push();
        var id = ref.key;
        ref.set({
            id: id,
            userId: userId,
            categoryName: categoryName,
            value: parseFloat(chargeValue),
            date: chargeDate
        });
    }

    getAllCategories();

    function getAllCategories() {
        return firebase.database().ref('/categories').once('value').then(function (category) {
            var categoryHash = category.val();
            var keys = Object.keys(categoryHash);
            var categories = keys.map(function (v) {
                return categoryHash[v];
            });

            $.each(categories, function (i, c) {
                $('#chargeType').append($('<option/>', {
                    value: c.name,
                    text: c.name
                }));
            });
        });
    }


    function writeCategory(name) {
        var ref = firebase.database().ref('categories').push();
        var id = ref.key;
        ref.set({
            id: id,
            name: name

        });
    }

}());







