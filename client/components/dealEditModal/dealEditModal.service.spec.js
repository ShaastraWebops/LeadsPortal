'use strict';

describe('Service: dealEditModal', function () {

  // load the service's module
  beforeEach(module('erp2015App'));

  // instantiate service
  var dealEditModal;
  beforeEach(inject(function (_dealEditModal_) {
    dealEditModal = _dealEditModal_;
  }));

  it('should do something', function () {
    expect(!!dealEditModal).toBe(true);
  });

});
