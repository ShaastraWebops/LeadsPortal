'use strict';

angular.module('erp2015App')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $state, $http) {
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
    
    $scope.notifications = [];
    $http.get('/api/notifications/myNotifs')
      .then(function (response) {
        if(response.status === 200)
          $scope.notifications = response.data;
      });
    
    $(window).bind('keydown', function (event) {
      var key = event.keyCode;
      if (key == "27") {
        if($scope.notif === true)
          $scope.$apply(function () {
            $scope.notif = false;
          });
      }
    });

    $scope.logout = function () {
      Auth.logout();
      // $location.path('/login');
      $state.go('login');
      // $location.url('/login'); 
    };

    $scope.isActive = function (route) {
      return route === $location.path();
    };
   
    $scope.showNotification = function () {
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


    $scope.notifDelete = function (index) {
      var id = $scope.notifications[index]._id;
      $scope.notifications.splice(index, 1);
      $http.post('/api/users/deleteNotifs', { notifs: [id] })
        .then(function (response) {
          // do nothing
        });
    };

    $scope.hideAllNotif = function () {
      var ids = []
      angular.forEach($scope.notifications, function (item) {
        ids.push(item._id);
      });      
      $scope.notifications = [];
      $http.post('/api/users/deleteNotifs', { notifs: ids })
        .then(function (response) {
          // do nothing
        });
    };

    $scope.notifClick = function (index) {
      $http.post('/api/users/deleteNotifs', { notifs: [$scope.notifications[index]._id] })
        .then(function (response) {
          $state.go('deal', { 'id': $scope.notifications[index].deal });
          if(response.status === 201)
            $scope.notifications.splice(index, 1);
        });
    };

  });