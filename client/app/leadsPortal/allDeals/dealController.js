	'use strict';

	angular.module('erp2015App')
	.controller('dealController', function ($scope, Auth, LeadsPortalService,$stateParams,$http,$q) {
	    $scope.selectedCoords = [];
	    $scope.update={};
		$scope.coordsIds=[];
		$http.get('/api/users/get/coords/')
		.success(function (data) {
			$scope.coords = data;
		angular.forEach($scope.coords,function(item){
           $scope.selectedCoords.push(item);
		})
		}).error(function (err){
			console.log(err);
		});
		$scope.deal={};
		console.log($stateParams.id);  
		LeadsPortalService.getDeal($stateParams.id)
		.then(function (deal) {
			$scope.deal = deal;
			$scope.deal.createdOn=deal.createdOn.split('T')[0];
			$scope.deal.updatedOn=deal.updatedOn.split('T')[0];
		})

	});
