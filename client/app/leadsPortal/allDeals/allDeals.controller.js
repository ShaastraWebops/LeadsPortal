	'use strict';

angular.module('erp2015App')
  .controller('AllDealsCtrl', function ($scope, $state, Auth, $http, LeadsPortalService, $stateParams) {
    	$scope.allDeals = [];
    	LeadsPortalService.getAllDeals()
    		.then(function (allDeals) {
    			$scope.allDeals = allDeals;
    		});
    	$scope.gotoDeal = function (deal) {
    		$state.go('deal', {id: deal._id});
    	}
  });
