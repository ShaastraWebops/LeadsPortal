'use strict';

angular.module('erp2015App')
  .controller('SignupCtrl', function ($scope, Auth, $state, $location, $window) {
    $scope.getCurrentUser = Auth.getCurrentUser;
    if (Auth.isLoggedIn())
      $state.go('coordPortalDashboard');

    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password,
          city: $scope.user.city,
          rollNumber: $scope.user.rollNumber,
          phoneNumber: $scope.user.phoneNumber,
          summerLocation: $scope.user.summerLocation,
          cgpa: $scope.user.cgpa
        })
        .then( function() {
          // Account created, redirect to dashboard
          $location.url('/coordPortal/dashboard');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
