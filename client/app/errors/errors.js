'use strict';

angular.module('erp2015App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('404', {
        url: '/404',
        templateUrl: 'app/errors/404.html'
      })
      .state('500', {
      	url: '/500',
      	templateUrl: 'app/errors/500.html'
      });
  });