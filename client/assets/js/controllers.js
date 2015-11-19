

app.controller('startController', function($scope, myAuth, $state, userService) {
    $scope.profileSetup;
    $scope.grabAuth = myAuth.grabAuth;
    
    
    if ($scope.grabAuth) { 
        $scope.theUser = userService.getCurrentUser();
        $scope.allUsers = userService.getUser();
        
        console.log($scope.allUsers);
        console.log($scope.theUser);
        
        
    } else {
        $state.go('login');
    };
    
        
    
    $scope.logOut = function() {
        console.log($scope.theUser.fbID);
        var tmpID = $scope.theUser.fbID;
        userService.userOffline(tmpID);
        userService.clearCurrent();
        
        myAuth.userExit();
        $state.go('login');
    };
        
        
    
});




app.controller('loginController', function($scope, $state, myAuth, userService, $timeout) {
    
    $scope.theUser = userService.getCurrentUser();
    userService.clearCurrent();
    
    
    var tmpUser = {};
    
    var gotoPage = function() {
        $state.go('home');
    };
    
    
    
    $scope.loginUser = function() {
        
        myAuth.authRef.$authWithPassword({
            email: $scope.loginEmail,
            password: $scope.loginPassword
        
        }).then(function(authData) {
            console.log('logged in as: ', authData.uid);
            $scope.grabAuth = myAuth.grabAuth;
            
            if ($scope.grabAuth) { 
                $scope.loggedIn = userService.getUser();
                
                $scope.loggedIn.$loaded()
                    .then(function() {
                        for (var i = 0; i < $scope.loggedIn.length; i++) {
                            if ($scope.loggedIn[i].loginID == $scope.grabAuth.uid) {
                                console.log($scope.loggedIn[i].user);
                                tmpUser = {
                                    fbID: $scope.loggedIn[i].$id,
                                    loginID: $scope.loggedIn[i].loginID,
                                    user: $scope.loggedIn[i].user,
                                    online: 'true'
                                };
                                    
                                
                                
                                
                                userService.userOnline(tmpUser.fbID);
                                userService.setCurrentUser(tmpUser);
                                
                                $timeout(gotoPage, 1000);
                                
                            }
                        }         
                    })
                    .catch(function(err) {
                        console.error(err);
                    });
                } else {
                    $state.go('home');
                }   
            
        }).catch(function(error) {
            console.log('failed to authenticate: ', error);
        });
    };
    
    $scope.registerUser = function() {
        $state.go('register');        
    };
});





app.controller('registerController', function($scope, $state, myAuth, userService) {
    $scope.cancelRegister = function() {
        $state.go('login');        
    };
    
    
    
    $scope.regUser = function () {
        myAuth.authRef.$createUser({
            email: $scope.loginEmail,
            password: $scope.loginPassword
        }).then(function(userData) {
            $scope.saveUser =  userService.addUser(userData.uid,$scope.loginEmail);  
            $state.go('home'); 
        }).catch(function(error) {
            alert(error);
        });
    };    
    
});






