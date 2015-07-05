'use strict';

angular.module('erp2015App')
.controller('CoresCtrl', function ($scope, LeadsPortalService, $location, $http, $state, $q, $mdDialog, $stateParams) {
  $scope.dealSubmitted = false;
  $scope.update = {};
  $scope.showButton = false;

  $scope.verticals = [];

  $scope.verticals = LeadsPortalService.verticals;
  LeadsPortalService.getAllVerticals()
  .then(function (data) {
    $scope.allVerticals = data;
  });

  $scope.vertical = [];

  //LeadsPortalService.getAllVerticals($stateParams.id)
    //.then(function (vertical) { 
        //$scope.vertical = vertical;
    //if(vertical.result === false) {
        //$scope.verticalresult = 'failure';
    //} else {
        //$scope.verticalresult = 'success';
    //}

  
  LeadsPortalService.getCoords()
  .then(function (data) {
    $scope.coords = data;
  },function (err){
     console.log(err);
  });
  $scope.selectedCoords = [];
  $scope.coordsIds=[];
   
  $scope.newDeal=function(form) {
    $scope.submitted = true;
    angular.forEach($scope.selectedCoords, function (item) {
      $scope.coordsIds.push(item._id);
    });

    if(form.$valid) {
      LeadsPortalService.createDeal({
        title: $scope.deal.title,
        info: $scope.deal.info,
        companyName: $scope.deal.companyName,
        vertical: JSON.parse($scope.deal.vertical),
        initialPointOfContactName: $scope.deal.initialPointOfContactName,
        initialPointOfContactNumber: $scope.deal.initialPointOfContactNumber,
        initialPointOfContactEmail: $scope.deal.initialPointOfContactEmail,
        assignees: $scope.coordsIds,
        status: false
      })
      .then(function (data) {
        $state.go('allDeals');
        sessionStorage.clear();
      })
      .catch(function (err) {
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
      .then(function (data) {
        console.log(data);
        $scope.verticalSubmitted = false;
        $scope.vertical.title = undefined;
        $scope.vertical.description = undefined;
      })
      .catch(function (err) {
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
      .then(function (data) {
        console.log(data);
        $state.go('leadsPortalAdmin');
      });

      $mdDialog.hide('Save edited vertical');
    };      
  };
  angular.module('demoapp', ['ngMdIcons']);
});
