'use strict';

angular.module('erp2015App')
  .controller('AllDealsCtrl', function ($scope, $filter, $state, Auth, LeadsPortalService) {

  $scope.allDeals = [];
  $scope.sortedDeals = [];
  $scope.selectedCoords = [];
  $scope.verticals = [];
  $scope.selectedVerticals = [];
  $scope.dealCategory = "All Deals";
  $scope.categories = ['All Deals', 'Open Deals', 'Closed Deals'];
  $scope.verticals = LeadsPortalService.verticals;
  
  $scope.dealsTitle = "List of all Deals";

  LeadsPortalService.getAllDeals()
    .then(function (allDeals) {
      $scope.allDeals = allDeals;
      if (sessionStorage.length == 0) {
        $scope.sortedDeals = allDeals;
        $scope.sortedcategory = allDeals;
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

    var allDeals = $scope.allDeals;
    $scope.sortedcategory = allDeals;

  $scope.onChange = function() {
    if($scope.searchText == undefined) {
      $scope.searchText = "";
    }

    var allDeals = $scope.allDeals;
    var DealCategory = String($scope.dealCategory);
    var sortedCategory = [];

      if(DealCategory == 'All Deals') {
        sortedCategory = allDeals;
        $scope.dealsTitle = "List of all Deals";
      }
      if(DealCategory == 'Open Deals') {
        sortedCategory = $filter('filter')(allDeals, { status: false });
        $scope.dealsTitle = "List of required Deals";
      }
      if(DealCategory == 'Closed Deals') {
        sortedCategory = $filter('filter')(allDeals, { status: true });
        $scope.dealsTitle = "List of required Deals";
      }
   
    $scope.sortedDeals = sortedCategory;
    $scope.sortedcategory = sortedCategory;
    $scope.onClick();
  };

  $scope.onClick = function() {
    sessionStorage.clear();
    var verticalSelected = $scope.selectedVerticals;
    var coordSelected = $scope.selectedCoords;
    var sortedVerticals = [];
    var sortedCoords = [];
    var sortedText = [];
    var sortedCategory = $scope.sortedcategory;
    
    angular.forEach(verticalSelected, function (item) { 
      var expression = { vertical: { name: item.name } };
      sortedVerticals = sortedVerticals.concat($filter('filter')(sortedCategory, expression));
    });
    angular.forEach(coordSelected, function (item) { 
      var expression = { assignees: { name: item.name } };
      sortedCoords = sortedCoords.concat($filter('filter')(sortedCategory, expression));
    });
    if (String($scope.searchText).length != 0) {
      sortedText = $filter('filter')(sortedCategory, String($scope.searchText));
    }

    if (verticalSelected.length != 0 || coordSelected.length != 0 || String($scope.searchText).length != 0) {
      $scope.sortedDeals = _.union(sortedVerticals, sortedCoords, sortedText);
    } else {
      $scope.sortedDeals = sortedCategory;
    };

    var storageObject = {
     "storedVerticals": verticalSelected,
     "storedCoords": coordSelected,
     "storedText": String($scope.searchText),
     "storedCategory": String($scope.dealCategory)
    };
    sessionStorage.setItem("storedVerticals", JSON.stringify(storageObject.storedVerticals));
    sessionStorage.setItem("storedCoords", JSON.stringify(storageObject.storedCoords));
    sessionStorage.setItem("storedText", storageObject.storedText);
    sessionStorage.setItem("storedCategory", storageObject.storedCategory);
  };

  function populateStorage() {
    $scope.selectedVerticals = JSON.parse(sessionStorage.getItem("storedVerticals"));
    $scope.selectedCoords = JSON.parse(sessionStorage.getItem("storedCoords"));
    $scope.searchText = sessionStorage.getItem("storedText");
    $scope.dealCategory = sessionStorage.getItem("storedCategory");
    $scope.dealsTitle = "List of required Deals";
    $scope.onChange();
  };
  
  $scope.gotoDeal = function (deal) {
    $state.go('deal', {id: deal._id});
  };

});