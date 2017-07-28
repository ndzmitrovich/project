define(['module', 'firebase', 'radio'],
    function (module, firebase, radio) {
        return {
            init: function () {
                firebase.initializeApp(module.config());
                this.authenticated = firebase.auth().currentUser || null;
                this.setupEvents();
            },

            setupEvents: function () {
                firebase.auth().onAuthStateChanged(function (user) {
                    this.setCurrentUser(user);
                    radio.trigger('auth/changed', user);
                    if (user) {
                        var chargeRef = firebase.database().ref('users/' + user.uid + '/charges');
                        chargeRef.on('value', function (snapshot) {
                            radio.trigger('db/loadUserCharges', this.getValuesFromHash(snapshot.val()));
                        }.bind(this));

                        var categoriesRef = firebase.database().ref('categories');
                        categoriesRef.on('value', function (snapshot) {
                            radio.trigger('db/loadCategories', this.getValuesFromHash(snapshot.val()));
                        }.bind(this));

                    } else {
                        // No user is signed in.
                    }
                }.bind(this));

            },

            setCurrentUser: function (value) {
                this.authenticated = value;
            },

            getCurrentUser: function () {
                return this.authenticated;
            },

            signInGoogle: function () {
                var provider = new firebase.auth.GoogleAuthProvider();
                provider.setCustomParameters({
                    'prompt': 'select_account'
                });
                firebase.auth().signInWithPopup(provider)
                    .then(function (result) {
                        var user = result.user;
                        console.log('Successfully authenticated!' + user.displayName);
                        // this.setCurrentUser(user);
                    }.bind(this))
                    .catch(function (error) {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.error(errorCode + errorMessage);
                    });
            },
            signOut: function () {
                firebase.auth().signOut()
                    .then(function () {
                        console.log('Successfully sign out!');
                    }.bind(this))
                    .catch(function (error) {
                        console.error(error.message);
                    });
            },
            saveCharge: function (charge) {
                var id = this.generateId();
                charge.id = id;
                firebase.database().ref('users/' + this.getCurrentUser().uid + '/charges/' + id).set(charge);
            },

            generateId: function () {
                return 'id' + (new Date()).getTime();
            },

            getValuesFromHash: function (hash) {
                var values = [];
                if (hash !== null) {
                    var keys = Object.keys(hash);
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        values.push(hash[key]);
                    }
                }
                return values;
            }

        }


    });