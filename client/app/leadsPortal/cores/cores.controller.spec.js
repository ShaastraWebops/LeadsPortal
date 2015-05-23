'use strict';

describe('Controller: CoresCtrl', function () {

  // load the controller's module
  beforeEach(module('erp2015App'));

  var CoresCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CoresCtrl = $controller('CoresCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
