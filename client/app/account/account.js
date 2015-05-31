'use strict';

angular.module('erp2015App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .state('forgotPassword', {
        url: '/forgotPassword',
        templateUrl: 'app/account/password/forgotPassword.html',
        controller: 'ForgotPasswordCtrl'
      })
      .state('resetPassword', {
        url: '/resetPassword/:token',
        templateUrl: 'app/account/password/resetPassword.html',
        controller: 'ResetPasswordCtrl'
      });                  
  });