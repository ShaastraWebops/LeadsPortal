'use strict';

angular.module('erp2015App')
.controller('CoresCtrl', function ($rootScope, $scope, LeadsPortalService, $location, $http, $state, $q, $mdDialog, $stateParams) {
  $scope.dealSubmitted = false;
  $scope.update = {};
  $scope.showButton = false;
  $scope.allVerticals = [];

  LeadsPortalService.getAllVerticals()
    .then(function (data) {
      $scope.allVerticals = data;
    });
  
  LeadsPortalService.getCoords()
    .then(function (data) {
      $scope.coords = data;
    },function (err){
       console.log(err);
    });
   
  $scope.selectedCoords = [];
  $scope.coordsIds = [];
  $scope.newDeal = function (form) {
    $scope.submitted = true;
    angular.forEach($scope.selectedCoords, function (item) {
      $scope.coordsIds.push(item._id);
    });

    if(form.$valid) {
      LeadsPortalService.createDeal({
        title: $scope.deal.title,
        info: $scope.deal.info,
        companyName: $scope.deal.companyName,
        vertical: JSON.parse($scope.deal.vertical)._id,
        initialPointOfContactName: $scope.deal.initialPointOfContactName,
        initialPointOfContactNumber: $scope.deal.initialPointOfContactNumber,
        initialPointOfContactEmail: $scope.deal.initialPointOfContactEmail,
        assignees: $scope.coordsIds
      })
      .then(function (response) {
        if(response.status === 201) {
          $scope.submitted = false;
          $state.go('deal', { id: response.data._id });
          // sessionStorage.clear();
        } else {
          $scope.submitted = false;
          $rootScope.showToast('Error occurred!');
        }
      })
      .catch(function (err) {
        $rootScope.showToast('Error! Check internet connection!');
        console.log(err);
        // err = err.data;
        // $scope.errors = {};

        // // Update validity of form fields that match the mongoose errors
        // angular.forEach(err.errors, function (error, field) {
        //   form[field].$setValidity('mongoose', false);
        //   $scope.errors[field] = error.message;
        // });
      });
    }
  };

  $scope.newVertical = function (formVertical) {
    $scope.verticalSubmitted = true;
   
    if(formVertical.$valid) {
      LeadsPortalService.createVertical({
        title: $scope.vertical.title,
        description: $scope.vertical.description,
      })
      .then(function (response) {
        if(response.status === 201) {
          $scope.allVerticals.push(response.data);
          $rootScope.showToast('Success!');
          $scope.verticalSubmitted = false;
          $scope.vertical.title = '';
          $scope.vertical.description = '';
        } else {
          $rootScope.showToast('Error occurred!');
          $scope.verticalSubmitted = false;
        }
      })
      .catch(function (err) {
        $rootScope.showToast('Error! Check internet connection!');
        console.log(err);
      });
    }
  };

// modal for editing the vertical
  $scope.verticalEditModal = function (vertical) {
    $mdDialog.show({
      controller: VerticalEditModalCtrl,
      templateUrl: '/app/leadsPortal/cores/verticalEditModal.tmpl.html',
      locals: {
        VerticalPassed: vertical
      }
    })
    .then(function (response) {
      console.log(response);
    }, function () {
      console.log('Cancel editing vertical');
    });
  };
  function VerticalEditModalCtrl($scope, $state, $mdDialog, VerticalPassed) {
    $scope.editVertical = {};
    $scope.editVertical = VerticalPassed;

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.save = function () {
      // do the saving part here
      LeadsPortalService.editVertical({
          _id: $scope.editVertical._id,
          title: $scope.editVertical.title,
          description: $scope.editVertical.description
      })
      .then(function (response) {
        if(response.status === 200) {
          $rootScope.showToast('Success!');
        } else {
          $rootScope.showToast('Error occurred!');
        }
      })
      .catch(function (err) {
        $rootScope.showToast('Error! Check internet connection!');
        console.log(err);
      });

      $mdDialog.hide('Save edited vertical');
    };      
  };
});
