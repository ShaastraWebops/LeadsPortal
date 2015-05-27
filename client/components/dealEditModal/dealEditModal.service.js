'use strict';

angular.module('erp2015App')
  .factory('dealEditModal', function ($mdDialog) {

    return function (deal) {
      console.log(deal);
      return $mdDialog.show({
        locals: { DealPassed: deal },
        controller: 'DealEditModalCtrl',
        templateUrl: 'dealEditModal.html',
        targetEvent: deal,
        bindToController: true
      });
    };
  });
