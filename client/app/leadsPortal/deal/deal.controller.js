'use strict';

angular.module('erp2015App')
  .controller('dealController', function ($scope, $state, Auth, LeadsPortalService, $stateParams, $http, $q, $mdDialog) {
    $scope.selectedCoords = [];
    $scope.update = {};
	$scope.coordsIds = [];
	LeadsPortalService.getCoords()
		.then(function (data) {
			$scope.coords = data;
			// console.log($scope.coords);
			// $scope.selectedCoords = $scope.coords;
			// console.log($scope.selectedCoords);
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

    // $scope.modal = function () {
    // 	console.log('came');
    // 	dealEditModal($scope.deal).then(function() {
    // 		console.log('yeahh');
    // 	}, function() {
    // 		console.log('loll');
    // 	});
    // };

    // modal for editing the deal
    $scope.dealModal = function () {
    	$mdDialog.show({
    		controller: DealEditModalCtrl,
    		templateUrl: '/app/leadsPortal/deal/dealEditModal.tmpl.html',
    		locals: {
    			DealPassed: $scope.deal,
    			CoordsPassed: $scope.coords
    		}
    	})
    	.then(function (response) {
    		console.log(response);
    	}, function () {
    		console.log('Cancel editing deal');
    	});
    };
    function DealEditModalCtrl($scope, $mdDialog, DealPassed, CoordsPassed) {
    	$scope.editDeal = DealPassed;
    	$scope.coords = CoordsPassed;
    	$scope.selectedCoords = [];
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.save = function () {
			// do the saving part here


			$mdDialog.hide('Save edited deal');
		};    	
    }

    // modal for editing the update 
    $scope.updateModal = function (update) {
    	$mdDialog.show({
    		controller: UpdateEditModalCtrl,
    		templateUrl: '/app/leadsPortal/deal/updateEditModal.tmpl.html',
    		locals: {
    			DealPassed: $scope.deal,
    			UpdatePassed: update
    		}
    	})
    	.then(function (response) {
    		console.log(response);
    	}, function () {
    		console.log('Cancel editing update');
    	});
    };
    function UpdateEditModalCtrl($scope, $mdDialog, DealPassed, UpdatePassed) {
    	$scope.deal = DealPassed;
    	$scope.editUpdate = UpdatePassed;
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.save = function () {
			// do the saving part here


			$mdDialog.hide('Save edited update');
		};    	
    }

    // modal for creating an update 
    $scope.updateCreateModal = function () {
    	$mdDialog.show({
    		controller: UpdateCreateModalCtrl,
    		templateUrl: '/app/leadsPortal/deal/updateCreateModal.tmpl.html',
    		locals: {
    			DealPassed: $scope.deal,
    		}
    	})
    	.then(function (response) {
    		console.log(response);
    	}, function () {
    		console.log('Cancel creating update');
    	});
    };
    function UpdateCreateModalCtrl($scope, $mdDialog, DealPassed) {
    	$scope.deal = DealPassed;
    	$scope.newUpdate = {};
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.save = function () {
			// do the saving part here


			$mdDialog.hide('Save created update');
		};    	
    }
});
