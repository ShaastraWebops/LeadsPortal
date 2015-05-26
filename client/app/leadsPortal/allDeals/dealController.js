	'use strict';

	angular.module('erp2015App').controller('dealController', function ($scope, Auth, LeadsPortalService, $stateParams, $http, $q) {
	    $scope.selectedCoords = [];
	    $scope.update = {};
		$scope.coordsIds = [];
		LeadsPortalService.getCoords()
		.then(function (data) {
			$scope.coords = data;
			console.log($scope.coords);
			angular.forEach($scope.coords, function (item) {
	           $scope.selectedCoords.push(item);
	           console.log(item);
			});
			console.log($scope.selectedCoords);
		},function (err) {
			console.log(err);
		});
		$scope.deal={};
		console.log(Auth.getCurrentUser()._id);
		console.log($stateParams.id);  
		LeadsPortalService.getDeal($stateParams.id)
		.then(function (deal) {
			$scope.deal = deal;
			$scope.deal.createdOn=deal.createdOn.split('T')[0];
			$scope.deal.updatedOn=deal.updatedOn.split('T')[0];
		})
		$scope.newDeal=function(form){
			$scope.submitted = true;
			angular.forEach($scope.selectedCoords,function(item){
				$scope.coordsIds.push(item._id);
			})
			LeadsPortalService.createUpdate({
				title:$scope.update.title,
				summary:$scope.udpate.summary,
				pointOfContactName:$scope.update.poc_name,
				pointOfContactNumber:$scope.update.poc_phone,
				pointOfContactEmail:$scope.update.poc_email,
				assignees:$scope.coordsIds,
				deal:$stateParams.id,
				assignee:Auth.getCurrentUser()._id
			})
			.then( function(data) {
				$state.go('deal');
			})
			.catch( function(err) {
				err = err.data;
				$scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
          	form[field].$setValidity('mongoose', false);
          	$scope.errors[field] = error.message;
          });
      });
		};
	});
