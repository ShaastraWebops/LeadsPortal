'use strict';

angular.module('erp2015App')
  .service('LeadsPortalService', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
  	return {
      createDeal:function(data){
        return $http.post('/api/deals', data).then(function(response){
          return response.data;
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
  				return response.data;
  			 });
  		},
  		createUpdate: function (data) {
  			return $http.post('/api/updates', data).then(function (response) {
  			 	return response.data;
  			});
  		},
  		editUpdate: function (data, updateId) {
  			 return $http.put('/api/updates/' + updateId, data).then(function (response) {
  				return response.data;
  			});
  		},
      getDeal: function (dealId) {
        return $http.get('api/deals/' + dealId).then(function (response) {
          return response.data;
        });
      },
      createVertical: function (data) {
        return $http.post('api/verticals', data).then(function (response) {
          return response.data;
        });
      
      },
      getAllVerticals: function () {
        return $http.get('/api/verticals').then(function (response) {
          return response.data;
        });
      },

      editVertical: function (data) {
         return $http.put('/api/verticals/' + data._id, data).then(function (response) {
          return response.data;
         });
      },
      
      verticals:[
      {
        name: 'One',
        value: 'one'
      },
      {
        name: 'Two',
        value: 'two'
      },
      {
        name: 'Three',
        value: 'three'
      },
      {
        name: 'Four',
        value: 'four'
      }
      ],
      getCoords:function(){
        return $http.get('/api/users/getCoords').then(function (response){
          return response.data;
        })
      },
      closeDeal:function (data) {
        return $http.put('/api/deals/closeDeal/'+ data._id, data).then(function (response){
          return response.data;
        });
      },
      openDeal:function (data) {
        return $http.put('api/deals/openDeal/'+ data._id).then(function (response){
          return response.data;
        });
      }
  	};
  });
