'use strict';

angular.module('erp2015App')
  .controller('AdminCtrl', function ($scope, $state, $http, Auth, User) {

    if (Auth.getCurrentUser().role === 'admin'){
      console.log('ok!')
    }
    else{
      $state.go('coordPortalDashboardCtrl');
    }

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
  });
