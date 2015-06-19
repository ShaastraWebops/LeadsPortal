'use strict';

angular.module('erp2015App')
  .controller('AllDealsCtrl', function ($scope, $filter, $state, Auth, LeadsPortalService) {

  $scope.allDeals = [];
  $scope.sortedDeals = [];
  $scope.selectedCoords = [];
  $scope.verticals = [];
  $scope.selectedVerticals = [];
  $scope.dealCategory = '';
  $scope.categories = ['All Deals', 'Open Deals', 'Closed Deals'];
  
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
    var searchText = String($scope.searchText);

    var sortedVerticals = [];
    var sortedCoords = [];
    var sortedText = [];
    var sortedCategory = [];
    var sortedDeals = [];
   
    $scope.dealsTitle = "List of required Deals";

    var allDeals = $scope.allDeals;
    if ($scope.dealCategory != '') {
      if($scope.dealCategory == 'All Deals') {
        sortedCategory = allDeals;
        $scope.dealsTitle = "List of all Deals";
      }
      if($scope.dealCategory == 'Open Deals') {
        sortedCategory = $filter('filter')(allDeals, { status: false });
        $scope.dealsTitle = "List of required Deals";
      }
      if($scope.dealCategory == 'Closed Deals') {
        sortedCategory = $filter('filter')(allDeals, { status: true });
        $scope.dealsTitle = "List of required Deals";
      }
    } else {
        sortedCategory = allDeals;
        $scope.dealsTitle = "List of all Deals";
    }
    angular.forEach(verticalSelected, function (item) { 
      var expression = { vertical: { name: item.name } };
      sortedVerticals = sortedVerticals.concat($filter('filter')(sortedCategory, expression));
    });
    angular.forEach(coordSelected, function (item) { 
      var expression = { assignees: { name: item.name } };
      sortedCoords = sortedCoords.concat($filter('filter')(sortedCategory, expression));
    });
    if (searchText.length != 0) {
      sortedText = $filter('filter')(sortedCategory, searchText);
    }
    if (verticalSelected.length != 0 || coordSelected.length != 0 || searchText.length != 0) {
      $scope.sortedDeals = _.union(sortedVerticals, sortedCoords, sortedText);
    } else {
      $scope.sortedDeals = sortedCategory;
    };
    
    var storageObject = {
     "storedVerticals": verticalSelected,
     "storedCoords": coordSelected,
     "storedText": String($scope.searchText),
     "storedCategory": String($scope.dealCategory),
     "storedDeals": $scope.sortedDeals
    };
    sessionStorage.setItem("storedVerticals", JSON.stringify(storageObject.storedVerticals));
    sessionStorage.setItem("storedCoords", JSON.stringify(storageObject.storedCoords));
    sessionStorage.setItem("storedText", storageObject.storedText);
    sessionStorage.setItem("storedCategory", storageObject.storedCategory);
    sessionStorage.setItem("storedDeals", JSON.stringify(storageObject.storedDeals));
  };
  
  function populateStorage() {
    $scope.sortedDeals = JSON.parse(sessionStorage.getItem("storedDeals"));
    $scope.selectedVerticals = JSON.parse(sessionStorage.getItem("storedVerticals"));
    $scope.selectedCoords = JSON.parse(sessionStorage.getItem("storedCoords"));
    $scope.searchText = sessionStorage.getItem("storedText");
    $scope.dealCategory = sessionStorage.getItem("storedCategory");
    $scope.dealsTitle = "List of required Deals";
  };
  
  $scope.gotoDeal = function (deal) {
    $state.go('deal', {id: deal._id});
  };

});