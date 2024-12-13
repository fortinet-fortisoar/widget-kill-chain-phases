/* Copyright start
    MIT License
    Copyright (c) 2024 Fortinet Inc
Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('killchainphases100Ctrl', killchainphases100Ctrl);

  killchainphases100Ctrl.$inject = ['$scope', 'widgetUtilityService', '$filter', '$rootScope', 'killchainPhasesService'];

  function killchainphases100Ctrl($scope, widgetUtilityService, $filter, $rootScope, killchainPhasesService) {
    var loadedSVGDocument;
    var svgLoaded = false;
    var fontFamily = '\'Lato\', sans-serif';
    $scope.currentTheme = $rootScope.theme.id;
    var countColor = $scope.currentTheme === 'light' ? '#000000' : '#F4CC46';
    var labelColor = $scope.currentTheme === 'light' ? '#000000' : '#FFF';

    $scope.mapKillChainStagesData = mapKillChainStagesData;

    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.viewWidgetVars = {
          // Create your translating static string variables here
        };
      });
    }


    // to create the topkillchainstage object to be passed to the topkillchain widget config
    function mapKillChainStagesData(data) {
      let _dataArray = []; //need to remove incase of bulk 
      _dataArray.push(data);
      // Create an object to store the count of each tag
      const killChainCounts = {
        'reconnaissance': 0,
        'weaponization': 0,
        'delivery': 0,
        'exploitation': 0,
        'installation': 0,
        'command-and-control': 0,
        'actions': 0
      };
      // Loop through each object in the data array and update the killChainCounts object
      _dataArray.forEach(item => {
        item.forEach(stage => {
          killChainCounts[stage] = (killChainCounts[stage] || 0) + 1;
        });
      });

      // Convert the killChainCounts object into an array of objects with tag and count properties
      const result = Object.keys(killChainCounts).map(stage => ({
        tag: killchainPhasesService.mapKillChainStageData(stage).tag, //displayName
        count: killChainCounts[stage],
        //color: killchainPhasesService.mapKillChainStageData(stage).color,
        //icon: killchainPhasesService.mapKillChainStageData(stage).icon,
        id: killchainPhasesService.mapKillChainStageData(stage).id
      }));

      return result;
    }

    function checkForSVGLoad() {
      document.getElementById('topkillChainStagesSVG').addEventListener('load', function () {
        loadedSVGDocument = this.getSVGDocument();
        svgLoaded = true;
        $scope.topKillChainStages.forEach(element => {
          addLabelCounts(element);
          addLabel(element)
        });
        //console.log("loaded", $scope.topKillChainStages);

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
        countDiv.setAttribute('style', 'color: ' + countColor + '; font-size: 16px;font-family:' + fontFamily + ';');
      }
      else {
        countDiv.setAttribute('style', 'color: ' + countColor + '; font-size: 16px;font-family:' + fontFamily + ';');
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
        countDiv.setAttribute('style', 'color: ' + labelColor + '; font-size: 16px;font-family:' + fontFamily + ';');
      }
      else {
        countDiv.setAttribute('style', 'color: ' + labelColor + '; font-size: 16px;font-family:' + fontFamily + ';');
      }
      countDiv.innerHTML = $filter('camelCaseToHuman')(element.tag);
      labelElem.appendChild(countDiv);
      source.after(labelElem);
    }

    function init() {
      // To handle backward compatibility for widget
      _handleTranslations();
  
      if ($scope.config.embedded) {
        $scope.embedded = true;
        $scope.topKillChainStages = mapKillChainStagesData($scope.config.data);
        setTimeout(() => {
          checkForSVGLoad();
        }, 10);
      }
      else{
        $scope.embedded = false;
        $scope.topKillChainStages = $scope.config.killchainDataJson;
      }

    }

    init();
  }
})();
