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
    
    $(window).bind('keydown', function (event) {
      var key = event.keyCode;
      if (key == "27") {
        if($scope.notif === true)
          $scope.$apply(function () {
            $scope.notif = false;
          });
      }
    });

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

    // For preventing the notif window scroll
    var previousScrollTop = 0;
    var scrollLock = false;
    $scope.scrollStop = function () {
      scrollLock = true;
    };

    $scope.scrollWork = function () {
      scrollLock = false;
    };

    $(window).scroll(function (event) {     
      if(scrollLock) {
        $(window).scrollTop(previousScrollTop); 
      }
      previousScrollTop = $(window).scrollTop();
    });


    $scope.notifHide = function(index) {
      $scope.notifications.splice(index, 1);
    };

    $scope.hideAllNotif = function() {
      $scope.notifications = [];
    };

  });