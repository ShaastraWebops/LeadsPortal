'use strict';

angular.module('erp2015App')
  .controller('AllDealsCtrl', function ($scope, Auth, LeadsPortalService) {
  	$scope.allDeals = [];
  	LeadsPortalService.getAllDeals()
  		.success(function (allDeals) {
  			$scope.allDeals = allDeals;
  		})
  		.error(function (err) {
  			// do error handling here
  			console.log(err);
  		});
  });
