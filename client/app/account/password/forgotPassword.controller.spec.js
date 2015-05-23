'use strict';

describe('Controller: ResetPasswordCtrl', function () {

  // load the controller's module
  beforeEach(module('erp2015App'));

  var ResetPasswordCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ResetPasswordCtrl = $controller('ResetPasswordCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
