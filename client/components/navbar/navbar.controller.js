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
    $scope.notifications = ["Deal x has been created by y and assigned to you and also to coord w on z day", "notification2", "notification3", "notification4"];
    
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
      } else {
        $scope.notif = false;
      }
    };

    $scope.notifHide = function(index) {
      $scope.notifications.splice(index, 1);
    };

    $scope.hideAllNotif = function() {
      $scope.notifications = [];
    };

  });