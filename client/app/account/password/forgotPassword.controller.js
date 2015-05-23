'use strict';

angular.module('erp2015App')
  .controller('ForgotPasswordCtrl', function ($scope, $http) {
    $scope.message = '';

    $scope.forgotPassword = function(form) {
    	$scope.submitted = true;
        $scope.message = 'Working...'

    	if(form.$valid) {
    		$http.post('/api/users/forgotPassword', { email: $scope.reset.email })
    		.success(function (message) {
    			$scope.message = 'Sent a mail to ' + $scope.reset.email + ' with further information';
                $scope.reset.email = '';
    		})
    		.error(function (message) {
    			$scope.message = 'Email does not exist (or) some error has occurred';
                $scope.reset.email = '';
    		});
    	}
    };
  });
