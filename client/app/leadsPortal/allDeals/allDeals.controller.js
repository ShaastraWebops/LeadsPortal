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
  //$scope.verticals = LeadsPortalService.verticals;
  
  $scope.dealsTitle = "List of all Deals";

  LeadsPortalService.getAllVerticals()
    .then(function(verticals){
      $scope.verticals=verticals;
    },function(err){
      console.log(err);
    });

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
    var dealDates = [];
    var sortDate = [];
    var sortedDate = [];
    var sortedCategory = $scope.sortedcategory;
    
    angular.forEach(verticalSelected, function (item) { 
      var expression = { vertical: { _id: item._id } };
      sortedVerticals = sortedVerticals.concat($filter('filter')(sortedCategory, expression));
    });
    angular.forEach(coordSelected, function (item) { 
      var expression = { assignees: { _id: item._id } };
      sortedCoords = sortedCoords.concat($filter('filter')(sortedCategory, expression));
    });
    if($scope.searchText == undefined) {
      $scope.searchText = "";
    }
    if ($scope.searchText != "") {
      sortedText = $filter('filter')(sortedCategory, $scope.searchText);
    }
    angular.forEach(sortedCategory, function (item) {
      var element = {};
      element.formatDate = $filter('date')(item.createdOn, 'yyyy-MM-dd');
      element._id = String(item._id);
      dealDates.push(element);
    });
    if ($scope.searchdate == undefined) {
      $scope.searchdate = "null";
    }
    if ($scope.searchdate != "null") {
     $scope.searchDate = $filter('date')(new Date($scope.searchdate), 'yyyy-MM-dd');
        // whenever we remove the date after search in the input box then the default date choosen by the date picker is "1970-01-01"
       if ($scope.searchDate == "1970-01-01") { 
          $scope.searchdate = "null"
       }
      sortDate = $filter('filter')(dealDates, { formatDate: $scope.searchDate });
      angular.forEach(sortDate, function (item) {
        sortedDate = sortedDate.concat($filter('filter')(sortedCategory, item._id));
      });
    } 
    if (verticalSelected.length != 0 || coordSelected.length != 0 || $scope.searchText != "" || $scope.searchdate != "null") {
      $scope.sortedDeals = _.union(sortedVerticals, sortedCoords, sortedText, sortedDate);
    } else {
      $scope.sortedDeals = sortedCategory;
    };

    var storageObject = {
     "storedVerticals": verticalSelected,
     "storedCoords": coordSelected,
     "storedText": $scope.searchText,
     "storedDate": $scope.searchdate,
     "storedCategory": String($scope.dealCategory)

    };
    sessionStorage.setItem("storedVerticals", JSON.stringify(storageObject.storedVerticals));
    sessionStorage.setItem("storedCoords", JSON.stringify(storageObject.storedCoords));
    sessionStorage.setItem("storedText", storageObject.storedText);
    sessionStorage.setItem("storedDate", storageObject.storedDate);
    sessionStorage.setItem("storedCategory", storageObject.storedCategory);
  };

  function populateStorage() {
    $scope.selectedVerticals = JSON.parse(sessionStorage.getItem("storedVerticals"));
    $scope.selectedCoords = JSON.parse(sessionStorage.getItem("storedCoords"));
    $scope.searchText = sessionStorage.getItem("storedText");
    $scope.searchdate = sessionStorage.getItem("storedDate");
    $scope.dealCategory = sessionStorage.getItem("storedCategory");
    $scope.dealsTitle = "List of required Deals";
    $scope.onChange();
  };
  
  $scope.gotoDeal = function (deal) {
    $state.go('deal', { id: deal._id });
  };

});