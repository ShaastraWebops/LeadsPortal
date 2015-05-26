	'use strict';

	angular.module('erp2015App')
	.controller('dealController', function ($scope, Auth, LeadsPortalService, $stateParams, $http, $q) {
	    $scope.selectedCoords = [];
	    $scope.update = {};
		$scope.coordsIds = [];
		$http.get('/api/users/get/coords/')
		.success(function (data) {
			$scope.coords = data;
			console.log($scope.coords);
			angular.forEach($scope.coords, function (item) {
	           $scope.selectedCoords.push(item);
	           console.log(item);
			});
			console.log($scope.selectedCoords);
		})
		.error(function (err) {
			// do some error handling here
			console.log(err);
		});
		$scope.deal={};
		console.log($stateParams.id);  
		LeadsPortalService.getDeal($stateParams.id)
		.then(function (deal) {
			$scope.deal = deal;
		});
		
		Auth.isLoggedInAsync(function (user) {
			console.log(user);
		});
		var user = Auth.getCurrentUser();
		console.log(user);
	});
