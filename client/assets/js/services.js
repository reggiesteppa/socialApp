var app = angular.module('socialapp');




app.factory('myAuth', function($firebaseAuth) {
    var ref = new Firebase('https://socialapp-angularfire.firebaseio.com');
    var fbAuth = $firebaseAuth(ref);
    var getAuth = fbAuth.$getAuth();
    
    var myAuth = {
        grabAuth: getAuth,
        authRef: fbAuth,
        userExit: function () {
            fbAuth.$unauth();
        }
        
    };
    
    return myAuth;

});


app.factory('userService', function($firebaseArray) {
    var myFB = new Firebase('https://socialapp-angularfire.firebaseio.com/users');
    var fbRef = $firebaseArray(myFB);
    var current = {};
    var userService = {
        addUser: function(id, username) {
            fbRef.$add({
            loginID: id,
            user: username,
            online: 'false'
            
            });
        },
        getUser: function(id) {
           return fbRef;
        },
        clearCurrent: function() {
            current = {};
        },
        
        setCurrentUser: function(user) {
            
            current = user;
        },
        getCurrentUser: function() {
            return current; 
            
        },
        userOnline: function(id) {
            var theID =  fbRef.$getRecord(id);
            theID.online = 'true';
            fbRef.$save(theID);
        },
        userOffline: function(id) {
            var myID =  fbRef.$getRecord(id);
            myID.online = 'false';
            fbRef.$save(myID);
        }
        
    };
    
    return userService;
    
});