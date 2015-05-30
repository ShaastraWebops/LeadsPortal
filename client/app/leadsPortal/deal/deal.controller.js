'use strict';

angular.module('erp2015App')
  .controller('dealController', function ($scope, $state, Auth, LeadsPortalService, $stateParams, $http, $q, $mdDialog) {
    $scope.selectedCoords = [];
    $scope.update = {};
	LeadsPortalService.getCoords()
		.then(function (data) {
			$scope.coords = data;
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

    // modal for editing the deal
    $scope.dealEditModal = function () {
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
    function DealEditModalCtrl($scope, $state, $mdDialog, DealPassed, CoordsPassed) {
    	$scope.editDeal = DealPassed;
    	$scope.coords = CoordsPassed;
        $scope.selectedCoords = DealPassed.assignees;


        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.save = function () {
            // do the saving part here
            $scope.coordIds = [];
            angular.forEach($scope.selectedCoords, function (item) {
              $scope.coordIds.push(item._id);
            });

            LeadsPortalService.editDeal({
                _id: $scope.editDeal._id,
                title: $scope.editDeal.title,
                info: $scope.editDeal.info,
                companyName: $scope.editDeal.companyName,
                initialPointOfContactName: $scope.editDeal.initialPointOfContactName,
                initialPointOfContactNumber: $scope.editDeal.initialPointOfContactNumber,
                initialPointOfContactEmail: $scope.editDeal.initialPointOfContactEmail,
                assignees: $scope.coordIds
            })
            .then(function (data) {
                $state.go('deal');
            });

			$mdDialog.hide('Save edited deal');
		};    	
    }

    // modal for editing the update 
    $scope.updateEditModal = function (update) {
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
            // console.log(UpdatePassed);
            console.log('saving edited update');
            LeadsPortalService.editUpdate({
                title: $scope.editUpdate.title,
                summary: $scope.editUpdate.summary,
                pointOfContactName: $scope.editUpdate.pointOfContactName,
                pointOfContactNumber: $scope.editUpdate.pointOfContactNumber,
                pointOfContactEmail: $scope.editUpdate.pointOfContactEmail,
                deal: $stateParams.id,
            },UpdatePassed._id)
            .then(function (data) {
                $state.go('deal');
            })
            .catch(function (err) {
                err = err.data;
                $scope.errors = {};
            });
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
    function UpdateCreateModalCtrl($scope, $stateParams, $mdDialog, DealPassed) {
    	$scope.deal = DealPassed;
    	$scope.newUpdate = {};
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.save = function () {
			// do the saving part here
            $scope.submitted = true;
            console.log('there');
            LeadsPortalService.createUpdate({
                title: $scope.newUpdate.title,
                summary: $scope.newUpdate.summary,
                pointOfContactName: $scope.newUpdate.pointOfContactName,
                pointOfContactNumber: $scope.newUpdate.pointOfContactNumber,
                pointOfContactEmail: $scope.newUpdate.pointOfContactEmail,
                deal: $stateParams.id
            })
            .then(function (data) {
                $state.go('deal');
            })
            .catch(function (err) {
                err = err.data;
                $scope.errors = {};
                 // Update validity of form fields that match the mongoose errors
    /*           angular.forEach(err.errors, function (error, field) {
                    form[field].$setValidity('mongoose', false);
                    $scope.errors[field] = error.message;
                 });*/
            });
            
			$mdDialog.hide('Save created update');
		};    	
    }
});
