

app.controller('startController', function($scope, myAuth, $state, userService) {
    
    $scope.grabAuth = myAuth.grabAuth;
    
    $scope.logOut = function() {
        myAuth.userExit();
        $state.go('login');
    };
        
        
    if ($scope.grabAuth) { 
        $scope.theUser = userService.getCurrentUser();
    } else {
        $state.go('login');
    }
});




app.controller('loginController', function($scope, $state, myAuth, userService) {
    
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
                                userService.setCurrentUser($scope.loggedIn[i].user);
                                $state.go('home');
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
        }).catch(function(error) {
            alert(error);
        });
    };    
    
});






