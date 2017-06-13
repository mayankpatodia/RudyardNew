angular.module('starter.controllers', [])

.controller('AuthCtrl', function($scope, $ionicConfig) {

})

// APP
.controller('AppCtrl', function($scope, $ionicConfig, $rootScope) {
  $scope.user = $rootScope.user;
})

.controller('ProfileCtrl', function($scope) {
  $scope.image = 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg';
})

//LOGIN
.controller('LoginCtrl', function($scope, $state, $templateCache, $q, $rootScope, $http, $rootScope) {
  $scope.doLogIn = function(user){
    //$state.go('app.feeds-categories');
  

  //$scope.user = {};

  var request = 'http://174.138.55.72/user/api_generic_post/?&source=api_signin&callback=JSON_CALLBACK';

  var params = {};

  params['email'] = user.email;
  params['password'] = user.password;

  $http({
    method: 'POST',
    data: params,
    url: request
  }).then(function successCallback(response) {
      
      var data = response.data;

    if(data.result == 'failure'){
      console.log(data.errors[0]);
    }
    else{
      $rootScope.user = data.user;
      $state.go('app.playlists');
      

    }


  }, function errorCallback(response) {
      
       console.log(response);

   });
  };
})

.controller('SignupCtrl', function($scope, $state) {
  $scope.user = {};

  $scope.user.email = "john@doe.com";

  $scope.doSignUp = function(){
    $state.go('app.feeds-categories');
  };
})

.controller('ForgotPasswordCtrl', function($scope, $state) {
  $scope.recoverPassword = function(){
    $state.go('app.feeds-categories');
  };

  $scope.user = {};
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
