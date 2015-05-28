'use strict';

angular.module('erp2015App')
  .controller('DashboardCtrl', function ($scope, $http, $stateParams, Auth, LeadsPortalService) {  
    	$scope.myDeals = [];  
    	LeadsPortalService.getDealsAssigned()
    		.then(function (deals) {
    			console.log(deals);
    			$scope.myDeals = deals;
    		});
  });
