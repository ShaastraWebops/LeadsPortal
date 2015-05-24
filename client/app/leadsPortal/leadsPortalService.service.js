'use strict';

angular.module('erp2015App')
  .service('LeadsPortalService', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
  	return {
  		getAllDeals: function () {
  			return $http.get('/api/deals').then(function (response) {
  				return response.data;
  			});
  		},
  		getDealsAssigned: function () {
  			return $http.get('/api/deals/myDeals').then(function (response) {
  				return response.data;
  			});
  		},
  		editDeal: function () {
  			// return $http.post('/api/deals').then(function (response) {
  			// 	return response.data;
  			// });
  		},
  		createUpdate: function () {
  			// return $http.post('/api/updates').then(function (response) {
  			// 	return response.data;
  			// });
  		},
  		editUpdate: function () {
  			// return $http.put('/api/updates').then(function (response) {
  			// 	return response.data;
  			// });
  		}
  	};
  });
