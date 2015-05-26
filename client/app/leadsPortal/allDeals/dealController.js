	'use strict';

angular.module('erp2015App')
  .controller('dealController', function ($scope, Auth, LeadsPortalService,$stateParams) {
  	$scope.deal={};
    console.log($stateParams.id);  
  	LeadsPortalService.getDeal($stateParams.id)
  		.then(function (deal) {
  			$scope.deal = deal;
  		})
  });
