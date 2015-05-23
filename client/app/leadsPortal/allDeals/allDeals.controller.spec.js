'use strict';

describe('Controller: AllDealsCtrl', function () {

  // load the controller's module
  beforeEach(module('erp2015App'));

  var AllDealsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AllDealsCtrl = $controller('AllDealsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
