'use strict';

angular.module('erp2015App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl',
        // data: {
        // 	permissions: {
        // 		except: ['admin', 'anonymous', 'user', 'core'],
        // 		redirectTo: 'coordPortalDashboard'
        // 	}
        // }
      });
  });