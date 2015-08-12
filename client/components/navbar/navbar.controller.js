'use strict';

angular.module('erp2015App')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $state) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.isCore = Auth.isCore;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.notif = false;
    $scope.notifClick = true;
    $scope.notifications = ["notification1", "notification2", "notification3", "notification4"];

    $scope.logout = function() {
      Auth.logout();
      // $location.path('/login');
      $state.go('login');
      // $location.url('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
   
    $scope.showNotification = function() {
      if ($scope.notif == false) {
        $scope.notif = true;
        $scope.notifClick = false;
      }
      else {
        $scope.notif = false;
      }
    };
  });