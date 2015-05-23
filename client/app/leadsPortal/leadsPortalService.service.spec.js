'use strict';

describe('Service: leadsPortalService', function () {

  // load the service's module
  beforeEach(module('erp2015App'));

  // instantiate service
  var leadsPortalService;
  beforeEach(inject(function (_leadsPortalService_) {
    leadsPortalService = _leadsPortalService_;
  }));

  it('should do something', function () {
    expect(!!leadsPortalService).toBe(true);
  });

});
