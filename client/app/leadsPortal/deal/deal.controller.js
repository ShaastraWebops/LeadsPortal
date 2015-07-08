'use strict';

angular.module('erp2015App')
  .controller('dealController', function ($rootScope, $scope, $state, $window, Auth, LeadsPortalService, $stateParams, $http, $mdDialog, $filter) {
  $scope.selectedCoords = [];
  $scope.update = {};
  $scope.showButton = false;

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
      if(deal.result === false) {
        $scope.dealresult = 'Failure';
      } else {
        $scope.dealresult = 'Success';
      }
    
      // showing editDeal, createUpdate, editUpdate button only to permitted users
      Auth.isLoggedInAsync(function (loggedIn) {
        if(Auth.getCurrentUser().role === 'admin' || Auth.getCurrentUser().role === 'core') {
          $scope.showButton = true;                    
        } else if (Auth.getCurrentUser().role === 'coord') {
          var len = deal.assignees.length;
          for (var i=0; i<len; i++) {
            if(Auth.getCurrentUser()._id === deal.assignees[i]._id)
              $scope.showButton = true;                    
          }
        } else {
          $scope.showButton = false;                    
        }
      });
    })
    .catch(function (err) {
      // do some error handling here
      console.log(err);
    });

  // modal for closing the deal
  $scope.dealCloseModal = function () {
    $mdDialog.show({
      controller: DealCloseModalCtrl,
      templateUrl: '/app/leadsPortal/deal/dealCloseModal.tmpl.html',
      locals: {
        DealPassed: $scope.deal
      }
    })
    .then(function (response) {
      if(response.status === 200) {
        $scope.deal = response.data;
        $rootScope.showToast('Successfully closed!');
      } else {
        $rootScope.showToast('Error occurred!');
      }
    }, function () {
      console.log('Cancel closing deal');
    });
  };
  function DealCloseModalCtrl($scope, $state, $mdDialog, DealPassed, Auth) {
    $scope.dealResult = false;
    $scope.dealComment = DealPassed.comment;
    $scope.closeDeal = {};
    $scope.closeDeal = DealPassed;

    $scope.isCoord = true;

    Auth.isLoggedInAsync(function (loggedIn) {
      if(Auth.getCurrentUser().role === 'coord') { $scope.isCoord = true; }
      else $scope.isCoord = false;
    });

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.save = function () {
    // do the saving part here
      LeadsPortalService.closeDeal({
        _id: $scope.closeDeal._id,
        result: $scope.dealResult,
        comment: $scope.dealComment
      })
      .then(function (response) {
        $mdDialog.hide(response);
      })
      .catch(function (err) {
        // do some error handling here
        $rootScope.showToast('Error! Check internet connection!');
        $mdDialog.hide(err);
        console.log(err);
      });
    };      
  }

  $scope.dealOpen = function () {
    LeadsPortalService.openDeal({
      _id: $scope.deal._id
    })
    .then(function (response) {
      if(response.status === 200) {
        $scope.deal = response.data;
        $rootScope.showToast('Successfully opened!');
      } else {
        $rootScope.showToast('Error occurred!');
      }
    })
    .catch(function (err) {
      // do some error handling here
      $rootScope.showToast('Error! Check internet connection!');
      console.log(err);
    });    
  }
    
  // modal for editing the deal
  $scope.dealEditModal = function () {
  	$mdDialog.show({
  		controller: DealEditModalCtrl,
  		templateUrl: '/app/leadsPortal/deal/dealEditModal.tmpl.html',
  		locals: {
  			DealPassed: $scope.deal,
  			CoordsPassed: $scope.coords,
        VerticalPassed: $scope.deal.vertical
  		}
  	})
  	.then(function (response) {
      if(response.status === 200) {
        $scope.deal = response.data;
        $rootScope.showToast('Success!');
      } else {
        $rootScope.showToast('Error occurred!');
      }
  	}, function () {
  		console.log('Cancel editing deal');
  	});
  };
  function DealEditModalCtrl($scope, $state, $mdDialog, VerticalPassed, DealPassed, CoordsPassed, Auth) {
    $scope.editDeal = {};
    $scope.editDeal.vertical = {};
    $scope.editDeal = DealPassed;
    $scope.editDeal.vertical = VerticalPassed;

	  $scope.coords = CoordsPassed;
    $scope.selectedCoords = DealPassed.assignees;
    $scope.isCoord = true;
  
    LeadsPortalService.getAllVerticals()
      .then(function (data) {
        $scope.allVerticals = data;
      });

    Auth.isLoggedInAsync(function (loggedIn) {
      if(Auth.getCurrentUser().role === 'coord') { $scope.isCoord = true; }
      else $scope.isCoord = false;
    });

    $scope.changeVertical = function() {
      // converting the string to json due to md-select
      if(typeof $scope.editDeal.vertical === 'string')
        $scope.editDeal.vertical = JSON.parse($scope.editDeal.vertical);
    };
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
        vertical: $scope.editDeal.vertical._id,
        initialPointOfContactName: $scope.editDeal.initialPointOfContactName,
        initialPointOfContactNumber: $scope.editDeal.initialPointOfContactNumber,
        initialPointOfContactEmail: $scope.editDeal.initialPointOfContactEmail,
        assignees: $scope.coordIds
      })
      .then(function (response) {
        $mdDialog.hide(response);
      })
      .catch(function (err) {
        // do some error handling here
        $rootScope.showToast('Error! Check internet connection!');
			  $mdDialog.hide(err);
        console.log(err);
      });    
		};    	
  }

  // modal for editing the update 
  $scope.updateEditModal = function (update, index) {
    $mdDialog.show({
      controller: UpdateEditModalCtrl,
      templateUrl: '/app/leadsPortal/deal/updateEditModal.tmpl.html',
      locals: {
        DealPassed: $scope.deal,
        UpdatePassed: update
      }
    })
    .then(function (response) {
      if(response.status === 200) {
        $scope.deal.updates[index] = response.data;
        $rootScope.showToast('Success!');
      } else {
        $rootScope.showToast('Error occurred!');
      }
    }, function () {
      console.log('Cancel creating update');
    });
  };
  function UpdateEditModalCtrl($scope, $mdDialog, DealPassed, UpdatePassed, $filter) {
  	$scope.deal = DealPassed;
    $scope.editUpdate = UpdatePassed;
    $scope.editUpdate.nextActivityDate = new Date($filter('date')($scope.editUpdate.nextActivityDate, "yyyy-MM-dd"));
  	$scope.cancel = function() {
  		$mdDialog.cancel();
  	};
  	$scope.save = function () {
  	// do the saving part here
      LeadsPortalService.editUpdate({
        title: $scope.editUpdate.title,
        summary: $scope.editUpdate.summary,
        pointOfContactName: $scope.editUpdate.pointOfContactName,
        pointOfContactNumber: $scope.editUpdate.pointOfContactNumber,
        pointOfContactEmail: $scope.editUpdate.pointOfContactEmail,
        nextActivityAim: $scope.editUpdate.nextActivityAim,
        nextActivityDate: $scope.editUpdate.nextActivityDate,
        deal: $stateParams.id
      }, UpdatePassed._id)
      .then(function (response) {
        $mdDialog.hide(response);
      })
      .catch(function (err) {
        $mdDialog.hide(err);
        $scope.errors = {};
      });
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
      if(response.status === 201) {
        $scope.deal.updates.push(response.data);
        $rootScope.showToast('Success!');
      } else {
        $rootScope.showToast('Error occurred!');
      }
    }, function () {
      console.log('Cancel creating update');
    });
  };
  function UpdateCreateModalCtrl($scope, $stateParams, $mdDialog, DealPassed) {
    $scope.deal = DealPassed;
    $scope.newUpdate = {};
    $scope.newUpdate.pointOfContactName = DealPassed.initialPointOfContactName;
    $scope.newUpdate.pointOfContactEmail = DealPassed.initialPointOfContactEmail;
    $scope.newUpdate.pointOfContactNumber = DealPassed.initialPointOfContactNumber;
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.save = function () {
    // do the saving part here
      $scope.submitted = true;
      LeadsPortalService.createUpdate({
        title: $scope.newUpdate.title,
        summary: $scope.newUpdate.summary,
        pointOfContactName: $scope.newUpdate.pointOfContactName,
        pointOfContactNumber: $scope.newUpdate.pointOfContactNumber,
        pointOfContactEmail: $scope.newUpdate.pointOfContactEmail,
        nextActivityAim: $scope.newUpdate.nextActivityAim,
        nextActivityDate: $scope.newUpdate.nextActivityDate,
        deal: $stateParams.id
      })
      .then(function (response) {
        $mdDialog.hide(response);
      })
      .catch(function (err) {
        // do some error handling here
        $rootScope.showToast('Error! Check internet connection!');
        console.log(err);
      // Update validity of form fields that match the mongoose errors
/*           angular.forEach(err.errors, function (error, field) {
          form[field].$setValidity('mongoose', false);
          $scope.errors[field] = error.message;
       });*/
  		  $mdDialog.hide(err);
      });
  	};    	
  }

});
