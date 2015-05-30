'use strict';

angular.module('erp2015App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('leadsPortalDashboard', {
        url: '/dashboard',
        templateUrl: 'app/leadsPortal/dashboard/dashboard.html',
        controller: 'DashboardCtrl',
        authenticate: true
      })
      .state('leadsPortalAdmin', {
        url: '/cores',
        templateUrl: 'app/leadsPortal/cores/cores.html',
        controller: 'CoresCtrl',
        authenticate: true
      })
      .state('allDeals', {
        url: '/allDeals',
        templateUrl: 'app/leadsPortal/allDeals/allDeals.html',
        controller: 'AllDealsCtrl',
        authenticate: true
      })
      .state('deal', {
        url: '/deal/:id',
        templateUrl: 'app/leadsPortal/deal/deal.html',
        controller: 'dealController',
        authenticate: true
      });
  });