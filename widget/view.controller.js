/* Copyright start
  Copyright (C) 2008 - 2024 Fortinet Inc.
  All rights reserved.
  FORTINET CONFIDENTIAL & FORTINET PROPRIETARY SOURCE CODE
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('killchainphases100Ctrl', killchainphases100Ctrl);

  killchainphases100Ctrl.$inject = ['$scope', 'widgetUtilityService', '$filter', '$rootScope'];

  function killchainphases100Ctrl($scope, widgetUtilityService, $filter, $rootScope) {
    var loadedSVGDocument;
    var svgLoaded = false;
    var fontFamily = '\'Lato\', sans-serif';

    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.viewWidgetVars = {
          // Create your translating static string variables here
        };
      });
    }

    function checkForSVGLoad() {
      document.getElementById('topkillChainStagesSVG').addEventListener('load', function () {
        loadedSVGDocument = this.getSVGDocument();
        svgLoaded = true;
        $scope.topKillChainStages.forEach(element => {
          addLabelCounts(element);
          addLabel(element)
        });
        console.log("loaded", $scope.topKillChainStages);

      });
    }


    function addLabelCounts(element) {
      var source = loadedSVGDocument.getElementById(element.id);
      source.setAttribute('style', 'font-family:\'Lato\', sans-serif;');
      let bbox = source.getBBox();
      let x = bbox.x;
      let y = bbox.y;
      let width = 300;
      let height = bbox.height + 100;
      let labelElem = document.createElementNS(source.namespaceURI, 'foreignObject');
      labelElem.setAttribute('x', x);
      labelElem.setAttribute('y', y);
      labelElem.setAttribute('width', width);
      labelElem.setAttribute('height', height);

      var countDiv = document.createElement('div');
      countDiv.setAttribute('class', element.id);
      if ($scope.currentTheme === 'light') {
        countDiv.setAttribute('style', 'color: ' + $scope.textColor + '; font-size: 16px;font-family:' + fontFamily + ';');
      }
      else {
        countDiv.setAttribute('style', 'color: ' + $scope.textColor + '; font-size: 16px;font-family:' + fontFamily + ';');
      }
      countDiv.innerHTML = element.count;
      labelElem.appendChild(countDiv);
      source.after(labelElem);
    }

    function addLabel(element) {
      var source = loadedSVGDocument.getElementById(element.id + 'Label');
      source.setAttribute('style', 'font-family:\'Lato\', sans-serif;');
      let bbox = source.getBBox();
      let x = bbox.x;
      let y = bbox.y - 3;
      let width = 300;
      let height = bbox.height + 100;
      let labelElem = document.createElementNS(source.namespaceURI, 'foreignObject');
      labelElem.setAttribute('x', x);
      labelElem.setAttribute('y', y);
      labelElem.setAttribute('width', width);
      labelElem.setAttribute('height', height);

      var countDiv = document.createElement('div');
      countDiv.setAttribute('class', element.id + 'Label');
      if ($scope.currentTheme === 'light') {
        countDiv.setAttribute('style', 'color: ' + $scope.textColor + '; font-size: 16px;font-family:' + fontFamily + ';');
      }
      else {
        countDiv.setAttribute('style', 'color: ' + $scope.textColor + '; font-size: 16px;font-family:' + fontFamily + ';');
      }
      countDiv.innerHTML = $filter('camelCaseToHuman')(element.tag);
      labelElem.appendChild(countDiv);
      source.after(labelElem);
    }

    function init() {
      // To handle backward compatibility for widget
      _handleTranslations();
      $scope.currentTheme = $rootScope.theme.id;
      $scope.textColor = $scope.currentTheme === 'light' ? '#000000' : '#FFFFFF';
      $scope.hoverColor = $scope.currentTheme === 'light' ? '#000000' : '#36b9b0';
      if ($scope.config.embedded) {
        $scope.embedded = true;
        $scope.topKillChainStages = $scope.config.data;
      }

      setTimeout(() => {
        checkForSVGLoad();
      }, 10);
    }

    init();
  }
})();
