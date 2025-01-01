/* Copyright start
    MIT License
    Copyright (c) 2025 Fortinet Inc
Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('editKillchainphases100Ctrl', editKillchainphases100Ctrl);

  editKillchainphases100Ctrl.$inject = ['$scope', '$uibModalInstance', 'config', 'widgetUtilityService', '$timeout'];

  function editKillchainphases100Ctrl($scope, $uibModalInstance, config, widgetUtilityService, $timeout) {
    $scope.cancel = cancel;
    $scope.save = save;
    $scope.config = config;
    $scope.setkillchainData = setkillchainData;
    $scope.jsoneditorOptions = {
      name: 'Fields',
      mode: 'code',
      onEditable: function () {
        return {
          field: true,
          value: true
        };
      }
    };
    $scope.config.killchainDataJson = !angular.isArray($scope.config.killchainDataJson) ? $scope.config.killchainDataJson : {};

    function _handleTranslations() {
      let widgetNameVersion = widgetUtilityService.getWidgetNameVersion($scope.$resolve.widget, $scope.$resolve.widgetBasePath);

      if (widgetNameVersion) {
        widgetUtilityService.checkTranslationMode(widgetNameVersion).then(function () {
          $scope.viewWidgetVars = {
            // Create your translating static string variables here
          };
        });
      } else {
        $timeout(function () {
          $scope.cancel();
        });
      }
    }

    function init() {
      // To handle backward compatibility for widget
      _handleTranslations();
    }

    function setkillchainData(json) {
      if (angular.isString(json)) {
        try {
          $scope.config.killchainDataJson = JSON.parse(json);
        } catch (e) {
          // invalid JSON. skip the rest
          return;
        }
      }
    }

    init();

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

    function save() {
      $uibModalInstance.close($scope.config);
    }

  }
})();
