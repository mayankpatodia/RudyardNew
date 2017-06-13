// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform, $rootScope, $ionicConfig, $timeout, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    $rootScope.user = [
     {
       name : "Houssem",
       role : "Developer Advocate"
     },
     {
       name: "Clark",
       role: "Developer"
     }
  ];
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

    // This fixes transitions for transparent background views
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      if(toState.name.indexOf('auth.walkthrough') > -1)
      {
        // set transitions to android to avoid weird visual effect in the walkthrough transitions
        $timeout(function(){
          $ionicConfig.views.transition('android');
          $ionicConfig.views.swipeBackEnabled(false);
          console.log("setting transition to android and disabling swipe back");
        }, 0);
      }
    });
    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
      if(toState.name.indexOf('app.feeds-categories') > -1)
      {
        // Restore platform default transition. We are just hardcoding android transitions to auth views.
        $ionicConfig.views.transition('platform');
        // If it's ios, then enable swipe back again
        if(ionic.Platform.isIOS())
        {
          $ionicConfig.views.swipeBackEnabled(true);
        }
        console.log("enabling swipe back and restoring transition to platform default", $ionicConfig.views.transition());
      }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider


    //INTRO
    .state('auth', {
      url: "/auth",
      templateUrl: "views/auth/auth.html",
      abstract: true,
      controller: 'AuthCtrl'
    })

    .state('auth.walkthrough', {
      url: '/walkthrough',
      templateUrl: "views/auth/walkthrough.html"
    })

    .state('auth.login', {
      url: '/login',
      templateUrl: "views/auth/login.html",
      controller: 'LoginCtrl'
    })

    .state('auth.signup', {
      url: '/signup',
      templateUrl: "views/auth/signup.html",
      controller: 'SignupCtrl'
    })

    .state('auth.forgot-password', {
      url: "/forgot-password",
      templateUrl: "views/auth/forgot-password.html",
      controller: 'ForgotPasswordCtrl'
    })

    .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "views/app/side-menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/auth/walkthrough');
});
