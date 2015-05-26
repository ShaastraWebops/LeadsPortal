'use strict';

angular.module('erp2015App').controller('dealController', function ($scope, $state,Auth, LeadsPortalService, $stateParams, $http, $q) {
    $scope.selectedCoords = [];
    $scope.update = {};
	$scope.coordsIds = [];
	LeadsPortalService.getCoords()
		.then(function (data) {
			$scope.coords = data;
			console.log($scope.coords);
			$scope.selectedCoords = $scope.coords;
			console.log($scope.selectedCoords);
		})
		.catch(function (err) {
			// do some error handling here
			console.log(err);
		});

	$scope.deal = {};

	LeadsPortalService.getDeal($stateParams.id)
		.then(function (deal) {
			$scope.deal = deal;
		})
		.catch(function (err) {
			// do some error handling here
			console.log(err);
		});

	 $scope.newUpdate = function (form) {
	 	$scope.submitted = true;
	 	angular.forEach($scope.selectedCoords, function (item) {
	 		$scope.coordsIds.push(item._id);
	 	});
	 	console.log('there');
	 	LeadsPortalService.createUpdate({
	 		title: $scope.update.title,
	 		summary: $scope.update.summary,
	 		pointOfContactName: $scope.update.poc_name,
	 		pointOfContactNumber: $scope.update.poc_phone,
	 		pointOfContactEmail: $scope.update.poc_email,
	 		assignees: Auth.getCurrentUser()._id,
	 		deal: $stateParams.id
	 	})
	 	.then(function (data) {
	 		$state.go('deal');
	 	})
	 	.catch(function (err) {
	 		err = err.data;
	 		$scope.errors = {};
	         // Update validity of form fields that match the mongoose errors
/*	         angular.forEach(err.errors, function (error, field) {
	         	form[field].$setValidity('mongoose', false);
	           	$scope.errors[field] = error.message;
	         });*/
         });
    };
});
