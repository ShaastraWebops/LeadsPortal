'use strict';

angular.module('erp2015App')
  .service('LeadsPortalService', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
  	return {
      createDeal:function (data) {
        return $http.post('/api/deals', data).then(function (response) {
          return response;
        });
      },
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
  		editDeal: function (data) {
  			return $http.put('/api/deals/' + data._id, data).then(function (response) {
  				return response;
  			 });
  		},
  		createUpdate: function (data) {
  			return $http.post('/api/updates', data).then(function (response) {
  			 	return response;
  			});
  		},
  		editUpdate: function (data, updateId) {
  			 return $http.put('/api/updates/' + updateId, data).then(function (response) {
  				return response;
  			});
  		},
      getDeal: function (dealId) {
        return $http.get('/api/deals/' + dealId).then(function (response) {
          return response.data;
        });
      },
      createVertical: function (data) {
        return $http.post('/api/verticals', data).then(function (response) {
          return response;
        });
      
      },
      getAllVerticals: function () {
        return $http.get('/api/verticals').then(function (response) {
          return response.data;
        });
      },
      editVertical: function (data) {
        return $http.put('/api/verticals/' + data._id, data).then(function (response) {
          return response;
        });
      },      
      getCoords:function(){
        return $http.get('/api/users/getCoords').then(function (response){
          return response.data;
        })
      },
      closeDeal:function (data) {
        return $http.put('/api/deals/closeDeal/'+ data._id, data).then(function (response){
          return response;
        });
      },
      openDeal:function (data) {
        return $http.put('api/deals/openDeal/'+ data._id).then(function (response){
          return response;
        });
      }
  	};
  });
