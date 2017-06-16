angular.module('starter.controllers', [])

.controller('AuthCtrl', function($scope, $ionicConfig, $state, $stateParams, $rootScope) {

  

  // document.addEventListener("deviceready", onDeviceReady, false);
  // function onDeviceReady() {
    
  // }

  

  $scope.pickContactUsingNativeUI = function () {
     $cordovaContacts.pickContact().then(function (contactPicked) {
       $scope.contact = contactPicked;
       
     });
   }
})

// APP
.controller('AppCtrl', function($scope, $ionicConfig, $rootScope) {

})

.controller('ProfileCtrl', function($scope, $rootScope, $http, $ionicPopup, $ionicModal, $state) {
  $scope.image = 'img/default-user.png';

  if($rootScope.getData('rudyard_user_info') == 'null'){
    $rootScope.showAlert('Error', 'Sorry, we could not authenticate you. Please login again to continue', true);
    $state.go('auth.walkthrough');
  }
  else{

    var request = 'http://174.138.55.72/user/api_generic/?&auth_token=' + $scope.user.auth_token + '&source=api_profile&callback=JSON_CALLBACK';
    $http.jsonp(request).
      success(function(data) {
        if(data.result == "failure"){
          $scope.showAlert('Error', 'Sorry, we could not authenticate you. Please login again to continue', true);
        }
        else{
          $scope.profile = data.user;
          $scope.user_edit = {};
          $scope.nonce = data.user.nonce;
          $scope.user_edit.first_name = data.user.first_name;
          $scope.user_edit.last_name = data.user.last_name;
          $scope.user_edit.phone = data.user.phone;
          $scope.user_edit.password = data.user.password;
        }
      }).
      error(function (data) {
        console.log(data);
        $scope.data = "Request failed";
      });
  }


  $scope.doRefresh = function(){
    var request = 'http://174.138.55.72/user/api_generic/?&auth_token=' + $scope.user.auth_token + '&source=api_profile&callback=JSON_CALLBACK';
    $http.jsonp(request).
      success(function(data) {
        if(data.result == "failure"){
          $scope.showAlert('Error', 'Sorry, we could not authenticate you. Please login again to continue', true);
        }
        else{
          $scope.profile = data.user;
          $scope.user_edit = {};
          $scope.nonce = data.user.nonce;
          $scope.user_edit.first_name = data.user.first_name;
          $scope.user_edit.last_name = data.user.last_name;
          $scope.user_edit.phone = data.user.phone;
          $scope.user_edit.password = data.user.password;
        }
      }).
      error(function (data) {
        console.log(data);
        $scope.data = "Request failed";
      }).
      error(function (data) {
        console.log(data);
        $scope.data = "Request failed";
      })
    .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  }

  $scope.signOut = function(){
    var sign_out_request = 'http://174.138.55.72/user/api_generic/?&auth_token=<value>&source=api_signout&callback=JSON_CALLBACK';
    $http.jsonp(sign_out_request).
      success(function(data) {
        if(data.result == "failure")
          $scope.showAlert('Error', 'Sorry, we could not authenticate you. Please login again to continue', true);
        else{
          NativeStorage.set("rudyard_user_info",
            'null',
            function (result) {
                $scope.showAlert('Signed Out', 'You\'ve signed out successfully. Please login again.', true);
                $state.go('auth.walkthrough');
            },
            function (e) {
                $scope.showAlert('Error', '' + e, true);
            });
        }

      }).
      error(function (data) {
        console.log(data);
        $scope.data = "Request failed";
      });
    
  };

  // Create our modal
  $ionicModal.fromTemplateUrl('views/app/edit-profile-modal.html', function(modal) {
    $scope.editProfileModal = modal;


  }, {
    scope: $scope
  });

  $scope.editSubmit = function(user){
      var request = 'http://174.138.55.72/user/api_generic_post/?source=api_profile_update&callback=JSON_CALLBACK';
      
      var params = {};

      params['first_name'] = $scope.user_edit.first_name;
      params['last_name'] = $scope.user_edit.last_name;
      params['phone'] = $scope.user_edit.phone;
      params['password'] = $scope.user_edit.password;
      params['nonce'] = $scope.nonce;
      
      $http({
        method: 'POST',
        data: params,
        url: request
      }).then(function successCallback(response) {
          
          var data = response.data;
        if(data.result == 'failure'){
          $scope.showAlert('Error!!', data.errors[0], true);
          return;

        }
        else{
          window.plugins.toast.showShortBottom('Profile Updated Successfully', 
            function(a){
              console.log('toast success: ' + a)
            }, function(b){
              alert('toast error: ' + b)
            })
          $scope.doRefresh();
          $scope.closeEditProfile();
          //location.reload();
        }


      }, function errorCallback(response) {
          showAlert('Error', "" + response, false);
           console.log(response);

       });


  }

  $scope.editProfile = function() {
    $scope.editProfileModal.show();
  };

  $scope.closeEditProfile = function() {
    $scope.editProfileModal.hide();
  }



})

//LOGIN
.controller('LoginCtrl', function($scope, $state, $templateCache, $q, $rootScope, $http, $ionicPopup, $ionicHistory) {
    $scope.user.email = 'jondoe@maildrop.cc';
    $scope.user.password = 'jondoe';

    $scope.doLogIn = function(user){
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
            $rootScope.showAlert('Error', data.errors[0], false);
            $rootScope.setData("rudyard_user_info", 'null');
            $ionicHistory.nextViewOptions({
                 disableBack: true
              });
            $state.go('auth.walkthrough');
          }
          else{
            $rootScope.user = data.user;
            if($rootScope.setData("rudyard_user_info", JSON.stringify(data.user)) != 'null')
                  $state.go('app.phonebook', {}, {location: "replace", reload: true});
          }
    }, function errorCallback(response) {
        $rootScope.setData("rudyard_user_info", 'null');
        $rootScope.showAlert('Error', JSON.stringify(response), false);
        $state.go('auth.walkthrough');
      });
    };
})

.controller('SignupCtrl', function($scope, $state) {
  $scope.user = {};

  $scope.user.email = "john@doe.com";

  $scope.doSignUp = function(){
    //$state.go('app.feeds-categories');
  };
})

.controller('ForgotPasswordCtrl', function($scope, $state) {
  $scope.recoverPassword = function(){
    //$state.go('app.feeds-categories');
  };

  $scope.user = {};
})

.controller('BillingCtrl', function($scope, $ionicConfig, $rootScope, $http) {
  var cont = $rootScope.getData('billing');
  if(cont == '' || cont == null){
    if($rootScope.getData('rudyard_user_info') == 'null'){
      $rootScope.showAlert('Error', 'Sorry, we could not authenticate you. Please login again to continue', true);
      $state.go('auth.walkthrough');
    }
    else{
      var request = 'http://174.138.55.72/user/api_generic/?&auth_token=<value>&source=api_billing_history&callback=JSON_CALLBACK';
      $http.jsonp(request).
      success(function(data) {
        if(data.result == "failure")
          $scope.showAlert('Error', 'Sorry, we could not authenticate you. Please login again to continue', true);
        else{
          $scope.billings = data.billing;
          $rootScope.setData('billing', '' + JSON.stringify($scope.billings));
        }

      }).
      error(function (data) {
        console.log(data);
        $scope.data = "Request failed";
      });
    }
  }
  else{
    $scope.billings = JSON.parse(cont);
  }

  $scope.doRefresh = function(){
    var request = 'http://174.138.55.72/user/api_generic/?&auth_token=<value>&source=api_billing_history&callback=JSON_CALLBACK';
    $http.jsonp(request).
    success(function(data) {
      if(data.result == "failure")
        $scope.showAlert('Error', 'Sorry, we could not authenticate you. Please login again to continue', true);
      else{
        $scope.billings = data.billing;
        $rootScope.setData('billing', '' + JSON.stringify($scope.billings));
      }

    }).
    error(function (data) {
      console.log(data);
      $scope.data = "Request failed";
    })
    .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  }
})

.controller('PhoneBookCtrl', function($scope, $ionicConfig, $rootScope, $http, $state, $ionicPopup, $ionicActionSheet, $ionicModal) {

  $scope.filterText = '';
  var cont = $rootScope.getData('contacts');
  if(cont == '' || cont == null){
    if($rootScope.getData('rudyard_user_info') == 'null'){
      $rootScope.showAlert('Error', 'Sorry, we could not authenticate you. Please login again to continue', true);
      $state.go('auth.walkthrough');
    }
    else{
      var request = 'http://174.138.55.72/user/api_generic/?&auth_token=' + $scope.user.auth_token + '&source=api_phone_book_get&callback=JSON_CALLBACK';
      $http.jsonp(request).
      success(function(data) {
        if(data.result == "failure")
          $rootScope.showAlert('Error', 'Sorry, we could not authenticate you. Please login again to continue', true);
        else{
          $scope.contacts = data.phone_book;
          $scope.nonce = data.user.nonce;
          $rootScope.setData('contacts', JSON.stringify($scope.contacts));
          $rootScope.setData('phonebook_nonce', $scope.nonce);
        }
        console.log($scope.contacts);
      }).
      error(function (data) {
        $rootScope.showAlert('Request failed', '' + data, false);
      });
    }
  }
  else{
    $scope.contacts = JSON.parse(cont);
  }



  $scope.filterBarVisible = false;


  $scope.doRefresh = function(){
    var request = 'http://174.138.55.72/user/api_generic/?&auth_token=' + $scope.user.auth_token + '&source=api_phone_book_get&callback=JSON_CALLBACK';
    $http.jsonp(request).
    success(function(data) {
      if(data.result == "failure")
        $rootScope.showAlert('Error', 'Sorry, we could not authenticate you. Please login again to continue', true);
      else{
        $scope.contacts = data.phone_book;
        $scope.nonce = data.user.nonce;
        $rootScope.setData('contacts', JSON.stringify($scope.contacts));
        $rootScope.setData('phonebook_nonce', $scope.nonce);
      }
      console.log($scope.contacts);
    }).
    error(function (data) {
      $rootScope.showAlert('Request failed', '' + data, false);
    })
    .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  }
  


    $scope.filterBarVisible = false;

    $scope.toggleFilterBar = function(){
      $scope.filterBarVisible = !$scope.filterBarVisible;
    }

    // Triggered on a button click, or some other target
    $scope.onHold = function(idx) {
      $scope.edit_idx = idx;

      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: 'Edit' },
          { text: 'Dial' },
          { text: 'Merge' }
        ],
        destructiveText: 'Delete',
        titleText: 'Select one option',
        cancelText: 'Cancel',
        cancel: function() {
             // add cancel code..
           },
        buttonClicked: function(index) {
          if(index == 0)
            $scope.editContact($scope.edit_idx);
          else if(index == 1)
            console.log("Rename");
          else
            console.log("View Transcript");
          return true;
        },
        destructiveButtonClicked: function() {
          $scope.showConfirm(idx);

          return true;
        }
      });

      // For example's sake, hide the sheet after two seconds
      $timeout(function() {
        //hideSheet();
      }, 2000);

    };


    $scope.deleteContact = function(idx){
      //$scope.contacts.splice(idx, 1);
      var id = $scope.contacts[idx].phone_book_id;
      var request = 'http://174.138.55.72/user/api_generic_post/?&source=api_phone_book_delete&callback=JSON_CALLBACK';
              
      var params = {};
      params['phone_book_id'] = id;
      params['nonce'] = $scope.nonce;

      $http({
        method: 'POST',
        data: params,
        url: request
      }).then(function successCallback(response) {
          
          var data = response.data;
          //$scope.showAlert('D', "" + JSON.stringify(data), false);
        if(data.result == 'failure'){
          $scope.showAlert('Error!!', data.errors[0],false);
          return;

        }
        else{
          //$scope.showAlert('Successful', 'Contact deleted successfully', false);
          window.plugins.toast.showShortBottom('Contact Deleted Successfully!', 
            function(a){
              console.log('toast success: ' + a)
            }, function(b){
              alert('toast error: ' + b)
            })
          $scope.doRefresh();
                          
        }


      }, function errorCallback(response) {
          $scope.showAlert('Error', response.data, false);
           console.log(response);

       });
    }



    // Create our modal
      $ionicModal.fromTemplateUrl('views/app/edit-contact-modal.html', function(modal) {
        $scope.editContactModal = modal;
      }, {
        scope: $scope
      });

      $scope.editSubmit = function(editUser){
        var request = 'http://174.138.55.72/user/api_generic_post/?source=api_phone_book_update&callback=JSON_CALLBACK';
                  
        var params = {};

        params['first_name'] = editUser.first_name;
        params['last_name'] = editUser.last_name;
        params['phone'] = editUser.phone;
        params['phone_book_id'] = $scope.contacts[$scope.edit_idx].phone_book_id;
        params['nonce'] = $scope.nonce;


        $http({
          method: 'POST',
          data: params,
          url: request
        }).then(function successCallback(response) {
            
            var data = response.data;
          if(data.result == 'failure'){
            $scope.showAlert('Error!!', data.errors[0],false);
            return;

          }
          else{
            window.plugins.toast.showShortBottom('Contact Updated Successfully!', 
              function(a){
                console.log('toast success: ' + a)
              }, function(b){
                alert('toast error: ' + b)
              })

            $scope.doRefresh();
            $scope.editContactModal.hide();
          }


        }, function errorCallback(response) {
            $scope.showAlert('Error', response.data, false);
             console.log(response);

         });
      } 
      $scope.editContact = function(idx) {
        $scope.editUser = $scope.contacts[idx];
        $scope.editContactModal.show();
      };

      
      $scope.closeEditContact = function() {
        $scope.editContactModal.hide();
      }




    // Create our modal
      $ionicModal.fromTemplateUrl('views/app/create-contact-modal.html', function(modal) {
        $scope.contactModal = modal;
      }, {
        scope: $scope
      });

      $scope.createContact = function(contact) {
        if(!contact)
          return;
        
        var request = 'http://174.138.55.72/user/api_generic_post/?source=api_phone_book_add&callback=JSON_CALLBACK';
        

          var params = {};

          params['first_name'] = contact.first_name;
          params['last_name'] = contact.last_name;
          if(!contact.phone){
            $rootScope.showAlert('Error', 'Invalid Phone Number', false);
            return;
          }

          params['phone'] = contact.phone;
          // params['country_code'] = contact.country_code;
          params['nonce'] = $scope.nonce;
            
          
          $http({
            method: 'POST',
            data: params,
            url: request
          }).then(function successCallback(response) {
              
              var data = response.data;
            if(data.result == 'failure'){
              $scope.showAlert('Error!!', data.errors[0],false);
              return;

            }
            else{
              // $scope.showAlert('Successful', 'Contact added successfully', false);
              window.plugins.toast.showShortBottom('Contact Added Successfully!', 
                function(a){
                  console.log('toast success: ' + a)
                }, function(b){
                  alert('toast error: ' + b)
                })
              $scope.doRefresh();
              $scope.closeNewContact();
            }


          }, function errorCallback(response) {
              $scope.showAlert('Error', response.data, false);
               console.log(response);

           });



        //$scope.contactModal.hide();

        contact.first_name = "";
        contact.last_name = "";
        contact.phone = "";
      };

      $scope.pick = function(){
        navigator.contacts.pickContact(function(foundContact){
          $scope.contact = {};
          var fullName = foundContact.displayName.split(' ');
          $scope.contact.first_name = fullName[0];
          if(fullName.length > 1)
            $scope.contact.last_name = fullName[fullName.length - 1];
          $scope.numbers = foundContact.phoneNumbers;
          if($scope.numbers.length == 1)
            $scope.selectTitle = 'Confirm Number'
          else
            $scope.selectTitle = 'Select Number'
          $scope.showPopup();
        },function(err){
            //$rootScope.showAlert('D', 'Error:' + JSON.stringify(err), false);
        });
      }

      function onResume(resumeEvent) {
          if(resumeEvent.pendingResult) {
              if(resumeEvent.pendingResult.pluginStatus === "OK") {
                  var contact = navigator.contacts.create(resumeEvent.pendingResult.result);
                  successCallback(contact);
              } else {
                  failCallback(resumeEvent.pendingResult.result);
              }
          }
      }

      // Triggered on a button click, or some other target
      $scope.showPopup = function() {
        $scope.data = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
          template: '<div class="list">' + 
                      '<a class="item" ng-repeat="number in numbers" ng-click="setPhone(number.value)">' +
                          '<h2 class="red-fg">{{number.value}}</h2>' +
                        '</a>' +
                      '</div>',
          title: $scope.selectTitle,
          scope: $scope,
          buttons: [
            { text: 'Dismiss' },
          ]
        });

        $scope.setPhone = function(num){
          $scope.contact.phone = num;
          myPopup.close();
        }
      }




      $scope.newContact = function() {
        $scope.contactModal.show();
      };

      $scope.closeNewContact = function() {
        $scope.contactModal.hide();
        return;
      }

    // A confirm dialog
     $scope.showConfirm = function(idx) {
       var confirmPopup = $ionicPopup.confirm({
         title: 'Reset Password',
         template: 'Are you sure you want to delete the contact?'
       });

       confirmPopup.then(function(res) {
         if(res) {
           $scope.deleteContact(idx);
         } else {

         }
       });
     };

    $scope.dialNumber = function(number){
      function onSuccess(result){
         console.log("Success:"+result);
       }

       function onError(result) {
         console.log("Error:"+result);
       }
       window.plugins.CallNumber.callNumber(onSuccess, onError, number, false);

    }


})

.controller('RecordingsCtrl', function($scope, $ionicConfig, $rootScope, $http, $state, $stateParams) {
  var cont = $rootScope.getData('recordings');

  $scope.filterBarVisible = false;

  $scope.toggleFilterBar = function(){
    $scope.filterText = '';
    $scope.filterBarVisible = !$scope.filterBarVisible;
  }
  
  if(cont == '' || cont == null){
    if($rootScope.getData('rudyard_user_info') == 'null'){
      $rootScope.showAlert('Error', 'Sorry, we could not authenticate you. Please login again to continue', true);
      $state.go('auth.walkthrough');
    }
    else{
      var request = 'http://174.138.55.72/user/api_generic/?&auth_token=' + $scope.user.auth_token + '&source=api_get_call_log&callback=JSON_CALLBACK';
      $http.jsonp(request).
      success(function(data) {
        if(data.result == "failure")
          $rootScope.showAlert('Error', 'Sorry, we could not authenticate you. Please login again to continue', true);
        else{
          $scope.recordings = data.callLog;
          $rootScope.setData('recordings', JSON.stringify($scope.recordings));
        }
      }).
      error(function (data) {
        $rootScope.showAlert('Request failed', '' + data, false);
      });
    }
  }
  else{
    $scope.recordings = JSON.parse(cont);
  }

  $scope.doRefresh = function(){
    var request = 'http://174.138.55.72/user/api_generic/?&auth_token=' + $scope.user.auth_token + '&source=api_phone_book_get&callback=JSON_CALLBACK';
    $http.jsonp(request).
    success(function(data) {
      if(data.result == "failure")
        $rootScope.showAlert('Error', 'Sorry, we could not authenticate you. Please login again to continue', true);
      else{
        $scope.contacts = data.phone_book;
        $scope.nonce = data.user.nonce;
        $rootScope.setData('recordings', JSON.stringify($scope.contacts));
        $rootScope.setData('recordings_nonce', $scope.nonce);
      }
      console.log($scope.contacts);
    }).
    error(function (data) {
      $rootScope.showAlert('Request failed', '' + data, false);
    })
    .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  }

  $scope.play = function(val){
    $state.go('app.single',{id: JSON.stringify(val)});
  }
  
})

.controller('PlayRecordingCtrl', function($scope, $ionicConfig, $rootScope, $stateParams, $state) {
  $scope.recording = JSON.parse($state.params.id);
  $scope.aud = document.getElementById("myAudio");
  $scope.aud.src = '';
  $scope.aud.src = $scope.recording.RecordingUrl;
})

.controller('AddMinutesCtrl', function($scope, $ionicConfig, $rootScope) {

  
});