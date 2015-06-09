	'use strict';

angular.module('erp2015App')
  .controller('AllDealsCtrl', function ($scope, $filter, $state, Auth, $http, LeadsPortalService, $stateParams) {
  	
   LeadsPortalService.getCoords()
  .then(function (data) {
    $scope.coords = data;
  },function (err){
     console.log(err);
  });
   
   $scope.selectedCoords = [];
   
   $scope.verticals = [];
   $scope.verticals = LeadsPortalService.verticals;

   $scope.selectedVerticals = [];

   var sortedVerticals = [];
   var sortedCoords = [];
  
  $scope.search=function() {
    var verticalSelected = [];
   angular.forEach($scope.selectedVerticals, function (item) {
         verticalSelected.push(item.name);
      });
    var coordSelected = [];
   angular.forEach($scope.selectedCoords, function (item) {
         coordSelected.push(item.name);
    });

     sortedVerticals = [];
     sortedCoords = [];

      $scope.allDeals = [];
      var sortedDeals = [];

      LeadsPortalService.getAllDeals()
      .then(function (allDeals) {
   angular.forEach(verticalSelected, function (item) { 
        var expression =  { 
               vertical: { name: item }
          };
        sortedVerticals = sortedVerticals.concat($filter('filter')(allDeals, expression));
        });
   angular.forEach(coordSelected, function (item) { 
      var expression =  { 
               assignees: { name: item }
          };
        sortedCoords = sortedCoords.concat($filter('filter')(allDeals, expression));
        });
      sortedDeals = _.union(sortedVerticals, sortedCoords);
      $scope.allDeals = sortedDeals;
      if (sortedDeals.length == 0){
         $scope.allDeals = allDeals;
          };
      });
    };   
   
   $scope.allDeals = [];
    LeadsPortalService.getAllDeals()
      .then(function (allDeals) {
        $scope.allDeals = allDeals;
      });

  $scope.gotoDeal = function (deal) {
  		$state.go('deal', {id: deal._id});
  	}
  });
