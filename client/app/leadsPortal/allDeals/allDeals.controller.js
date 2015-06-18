'use strict';

angular.module('erp2015App')
  .controller('AllDealsCtrl', function ($scope, $filter, $state, Auth, LeadsPortalService) {

  $scope.allDeals = [];
  $scope.sortedDeals = [];
  $scope.selectedCoords = [];
  $scope.verticals = [];
  $scope.selectedVerticals = [];
  
  $scope.dealsTitle = "List of all Deals";

  LeadsPortalService.getAllDeals()
    .then(function (allDeals) {
      $scope.allDeals = allDeals;
      if (sessionStorage.length == 0) {
        $scope.sortedDeals = allDeals;
      } else { 
        populateStorage(); 
      }; 
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
    sessionStorage.clear();
    var verticalSelected = $scope.selectedVerticals;
    var coordSelected = $scope.selectedCoords;

    var sortedVerticals = [];
    var sortedCoords = [];
    var sortedText = [];
    var sortedDeals = [];
   
    $scope.dealsTitle = "List of required Deals";

    var allDeals = $scope.allDeals;
    angular.forEach(verticalSelected, function (item) { 
      var expression = { vertical: { name: item.name } };
      sortedVerticals = sortedVerticals.concat($filter('filter')(allDeals, expression));
    });
    angular.forEach(coordSelected, function (item) { 
      var expression = { assignees: { name: item.name } };
      sortedCoords = sortedCoords.concat($filter('filter')(allDeals, expression));
    });
    if (String($scope.searchText).length != 0) {
      sortedText = $filter('filter')(allDeals, String($scope.searchText));
      console.log(sortedText.length
        );
    };
    if (verticalSelected.length != 0 || coordSelected.length != 0 || sortedText.length != 0) {
      $scope.sortedDeals = _.union(sortedVerticals, sortedCoords, sortedText);
    } else {
      $scope.sortedDeals = allDeals;
      $scope.dealsTitle = "List of all Deals";
    };
    
    var storageObject = {
     "storedVerticals": verticalSelected,
     "storedCoords": coordSelected,
     "storedText": String($scope.searchText),
     "storedDeals": $scope.sortedDeals
    };
    sessionStorage.setItem("storedVerticals", JSON.stringify(storageObject.storedVerticals));
    sessionStorage.setItem("storedCoords", JSON.stringify(storageObject.storedCoords));
    sessionStorage.setItem("storedText", storageObject.storedText);
    sessionStorage.setItem("storedDeals", JSON.stringify(storageObject.storedDeals));
  };  
  function populateStorage() {
    $scope.sortedDeals = JSON.parse(sessionStorage.getItem("storedDeals"));
    $scope.selectedVerticals = JSON.parse(sessionStorage.getItem("storedVerticals"));
    $scope.selectedCoords = JSON.parse(sessionStorage.getItem("storedCoords"));
    $scope.searchText = sessionStorage.getItem("storedText");
    $scope.dealsTitle = "List of required Deals";
  };
  
  $scope.gotoDeal = function (deal) {
    $state.go('deal', {id: deal._id});
  };

});