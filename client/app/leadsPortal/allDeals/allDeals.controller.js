	'use strict';

angular.module('erp2015App')
  .controller('AllDealsCtrl', function ($scope, Auth, $http,LeadsPortalService,$stateParams) {
  $scope.coords=[];$scope.map={};
  $http.get('/api/users/get/coords/')
  .success(function (data) {
    $scope.coords = data;
    angular.forEach($scope.coords,function(coord){
    console.log(coord);
    $scope.map[coord._id]=coord.name;
   })
  }).error(function (err){
     console.log(err);
  });
   console.log($scope.map);
  	$scope.allDeals = [];
  	LeadsPortalService.getAllDeals()
  		.then(function (allDeals) {
  			$scope.allDeals = allDeals;
  			var i=0;
  			angular.forEach(allDeals,function(item){
  				$scope.allDeals[i++].createdOn=item.createdOn.split('T')[0];
  			})
  		})

  });
