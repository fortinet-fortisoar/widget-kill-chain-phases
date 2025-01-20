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
            HEADER_ADD_KILL_CHAIN_PHASES: widgetUtilityService.translate('killchainphases.HEADER_ADD_KILL_CHAIN_PHASES'),
            HEADER_EDIT_KILL_CHAIN_PHASES: widgetUtilityService.translate('killchainphases.HEADER_EDIT_KILL_CHAIN_PHASES'),
            LABEL_KILL_CHAIN_PHASES_JSON: widgetUtilityService.translate('killchainphases.LABEL_KILL_CHAIN_PHASES_JSON')
          };
          $scope.header = $scope.config.title ? $scope.viewWidgetVars.HEADER_EDIT_KILL_CHAIN_PHASES : $scope.viewWidgetVars.HEADER_ADD_KILL_CHAIN_PHASES;
        });
      } else {
        $timeout(function () {
          cancel();
        },100);
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
      if (!$scope.killchainForm.$valid) {
        $scope.killchainForm.$setTouched();
        $scope.killchainForm.$focusOnFirstError();
        return;
      }
      $uibModalInstance.close($scope.config);
    }

  }
})();
