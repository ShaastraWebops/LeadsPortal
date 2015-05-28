	'use strict';

angular.module('erp2015App')
  .controller('AllDealsCtrl', function ($scope, Auth, $http, LeadsPortalService, $stateParams) {
    	$scope.allDeals = [];
    	LeadsPortalService.getAllDeals()
    		.then(function (allDeals) {
          console.log(allDeals);
    			$scope.allDeals = allDeals;
    		});
  });
