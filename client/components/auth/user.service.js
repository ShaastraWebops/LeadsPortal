'use strict';

angular.module('erp2015App')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      updateProfile: {
        method: 'PUT',
        params: {
          controller:'updateProfile'
        }
      }
	  });
  });
