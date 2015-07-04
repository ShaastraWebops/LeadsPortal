'use strict';

angular.module('erp2015App')
.controller('CoresCtrl', function ($scope, LeadsPortalService, $location, $http, $state, $q, $mdDialog, $stateParams) {
  $scope.submitted = false;
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

   $scope.newVertical=function(formVertical) {
    $scope.submitted = true;
   
    if(formVertical.$valid) {
      LeadsPortalService.createVertical({
        title: $scope.vertical.title,
        description: $scope.vertical.description,
      })
      .then(function (data) {
        console.log(data);
      })
      .catch(function (err) {
        console.log(err);
      });
    }
  };

// modal for editing the vertical
   $scope.verticalEditModal = function () {
    $mdDialog.show({
      controller: VerticalEditModalCtrl,
      templateUrl: 'server/api/vertical/verticalEditModal.tmpl.html',
      locals: {
        VerticalPassed: $scope.vertical,
        //CoordsPassed: $scope.coords,
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
      //$scope.editVertical.vertical = {};
      $scope.editVertical = VerticalPassed;
      //$scope.editVertical.vertical['name'] = VerticalName;
      //$scope.editVertical.vertical['value'] = VerticalValue;

      //$scope.coords = CoordsPassed;
      //$scope.selectedCoords = VerticalPassed.assignees;
      //$scope.isCoord = true;
      //$scope.editVerticals = LeadsPortalService.editVerticals;

      $scope.changeVertical = function() {
          // converting the string to json due to md-select
          if(typeof $scope.editVertical === 'string')
              $scope.editVertical = JSON.parse($scope.editVerticals);
      };
      $scope.cancel = function() {
          $mdDialog.cancel();
      };
      $scope.save = function () {
          // do the saving part here
          //$scope.coordIds = [];
          //angular.forEach($scope.selectedCoords, function (item) {
            //$scope.coordIds.push(item._id);
          //});

          LeadsPortalService.editVertical({
              _id: $scope.editVertical._id,
              title: $scope.editVertical.title,
              description: $scope.editVertical.description,
              assignees: $scope.coordIds
          })
          .then(function (data) {
              $state.go('vertical');
          });

          $mdDialog.hide('Save edited vertical');
      };      
  };

});
