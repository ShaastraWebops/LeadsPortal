	'use strict';

angular.module('erp2015App')
  .controller('AllDealsCtrl', function ($scope, Auth, LeadsPortalService,$stateParams) {
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
