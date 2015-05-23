'use strict';

angular.module('erp2015App')
  .controller('DashboardCtrl', function ($scope, Auth, LeadsPortalService) {
  	$scope.deals = [];
  	LeadsPortalService.getDealsAssigned()
  		.success(function (deals) {
  			console.log(deals);
  			$scope.deals = deals;
  		})
  		.error(function (err) {
  			// do error handling here 
  			console.log(err);
  		});

  	LeadsPortalService.updateDeal()
  		.success(function (message) {
  			console.log(message);
  		})
  		.error(function (err) {
  			// od error handling here
  			console.log(err);
  		});

  	LeadsPortalService.createUpdate()
  		.success(function (message) {
  			console.log(message);
  		})
  		.error(function (err) {
  			// od error handling here
  			console.log(err);
  		});

  	LeadsPortalService.updateUpdate()
  		.success(function (message) {
  			console.log(message);
  		})
  		.error(function (err) {
  			// od error handling here
  			console.log(err);
  		});
  });
