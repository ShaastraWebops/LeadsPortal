'use strict';

angular.module('erp2015App')
  .controller('DashboardCtrl', function ($scope, $http, $stateParams, Auth, LeadsPortalService) {  
   	$scope.myDeals = [];  
   	LeadsPortalService.getDealsAssigned()
   		.then(function (deals) {
   			$scope.myDeals = deals;
   		});
   	$scope.gotoDeal = function (deal) {
   		$state.go('deal', {id: deal._id});
   	}    	
  });
