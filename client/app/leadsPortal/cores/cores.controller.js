'use strict';

angular.module('erp2015App')
  .controller('CoresCtrl', function ($scope,LeadsPortalService,$location,$http) {
  $http.post('/api/users/filter',{role:'coord',filter:'name _id'}).success(function(data) {
    $scope.coords = data;
  })
  $scope.selectedCoords = [];
  $scope.coordsIds=[];

   $scope.newDeal=function(form){
        angular.forEach($scope.selectedCoords,function(item){
           $scope.coordsIds.push(item._id);
        })
        LeadsPortalService.createDeal({
        	title:$scope.deal.title,
        	info:$scope.deal.info,
        	companyName:$scope.deal.company,
        	initialPointOfContactName:$scope.deal.poc_name,
        	initialPointOfContactNumber:$scope.deal.poc_phone,
        	initialPointOfContactEmail:$scope.deal.poc_email,
        	assignees:$scope.coordsIds,
        	status:false,
        	createdOn:Date.now()
        })
        .then( function() {
          // Logged in, redirect to home
          // $location.path('/coordPortal/dashboard');
          $location.path('/cores');
        })
         .catch( function(err) {
           console.log(err);
        });
    };
  });
