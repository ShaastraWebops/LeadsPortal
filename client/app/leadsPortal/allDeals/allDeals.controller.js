'use strict';

angular.module('erp2015App')
  .controller('AllDealsCtrl', function ($scope, $filter, $state, Auth, LeadsPortalService) {

  $scope.allDeals = [];
  $scope.sortedDeals = [];
  $scope.selectedCoords = [];
  $scope.verticals = [];
  $scope.selectedVerticals = [];

  LeadsPortalService.getAllDeals()
    .then(function (allDeals) {
      $scope.allDeals = allDeals;
      $scope.sortedDeals = allDeals;
    }, function (err) {
       console.log(err);
    });
    
  LeadsPortalService.getCoords()
    .then(function (data) {
      $scope.coords = data;
    }, function (err) {
       console.log(err);
    });
   
  $scope.verticals = LeadsPortalService.verticals;
  
  $scope.search = function() {
    var verticalSelected = $scope.selectedVerticals;
    var coordSelected = $scope.selectedCoords;

    var sortedVerticals = [];
    var sortedCoords = [];
    var sortedDeals = [];

    var allDeals = $scope.allDeals;
    angular.forEach(verticalSelected, function (item) { 
      var expression = { vertical: { name: item.name } };
      sortedVerticals = sortedVerticals.concat($filter('filter')(allDeals, expression));
    });
    angular.forEach(coordSelected, function (item) { 
      var expression = { assignees: { name: item.name } };
      sortedCoords = sortedCoords.concat($filter('filter')(allDeals, expression));
    });
    if (verticalSelected.length != 0 || coordSelected.length != 0) {
      $scope.sortedDeals = _.union(sortedVerticals, sortedCoords);
    } else {
      $scope.sortedDeals = allDeals;
    };
  };   
  
  $scope.gotoDeal = function (deal) {
  	$state.go('deal', {id: deal._id});
  };

});
