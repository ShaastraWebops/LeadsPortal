	'use strict';

angular.module('erp2015App')
  .controller('AllDealsCtrl', function ($scope, Auth, LeadsPortalService, $stateParams) {
  	$scope.allDeals = [];
  	LeadsPortalService.getAllDeals()
  		.then(function (allDeals) {
  			$scope.allDeals = allDeals;
  		});
  });
