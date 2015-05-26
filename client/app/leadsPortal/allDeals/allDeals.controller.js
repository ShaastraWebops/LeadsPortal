	'use strict';

angular.module('erp2015App')
  .controller('AllDealsCtrl', function ($scope, Auth, $http,LeadsPortalService,$stateParams) {
  $scope.coords=[];$scope.map={};
  LeadsPortalService.getCoords()
  .then(function (data) {
    $scope.coords = data;
    angular.forEach($scope.coords,function(coord){
    console.log(coord);
    $scope.map[coord._id]=coord.name;
   })
  },function (err){
     console.log(err);
  });
   console.log($scope.map);
  	$scope.allDeals = [];
  	LeadsPortalService.getAllDeals()
  		.then(function (allDeals) {
  			$scope.allDeals = allDeals;
  		});
  });
