/* Copyright start
    MIT License
    Copyright (c) 2026 Fortinet Inc
Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('killchainphases200Ctrl', killchainphases200Ctrl);

  killchainphases200Ctrl.$inject = ['$scope', 'widgetUtilityService', '$filter', '$rootScope', 'killchainPhasesService', 'widgetBasePath', 'modelMetadatasService', '$state', '$sce', '$timeout'];

  function killchainphases200Ctrl($scope, widgetUtilityService, $filter, $rootScope, killchainPhasesService, widgetBasePath, modelMetadatasService, $state, $sce, $timeout) {
    var loadedSVGDocument;
    var svgLoaded = false;
    $scope.showMetrics = false;
    $scope.pageState = $state;
    var fontFamily = '\'Lato\', sans-serif';
    $scope.widgetBasePath = widgetBasePath;
    $scope.currentTheme = $rootScope.theme.id;
    if($scope.currentTheme === 'light') {
      $scope.svgPath = $scope.widgetBasePath + "widgetAssets/images/kill_chain_light.svg";
    }else if($scope.currentTheme === 'steel' || $scope.currentTheme === 'dark') {
      $scope.svgPath = $scope.widgetBasePath + "widgetAssets/images/kill_chain.svg";
    }else if($scope.currentTheme === 'deepSea') {
      $scope.svgPath = $scope.widgetBasePath + "widgetAssets/images/kill_chain_blue.svg";
    }
    const THEME_COLORS = {
      light: {
        active: '#4676b2',
        defaultFill: '#959393'
      },
      steel: {
        active: '#22a6af',
        defaultFill: '#3E3E3E'
      },
      dark: {
        active: '#2cafc3',
        defaultFill: '#3E3E3E'
      },
      deepSea: {
        active: '#497AD4',
        defaultFill: '#1F263B'
      }
    };

    // Fallback to dark if theme not found
    const colors = THEME_COLORS[$scope.currentTheme] || THEME_COLORS.dark;

    const activeColor = colors.active;
    const defaultFill = colors.defaultFill;

    $scope.activePhases = {};
    $scope.hoveredPhase = null;

    var countColor = $scope.currentTheme === 'light' ? '#f4930f' : '#F4CC46';
    var labelColor = $scope.currentTheme === 'light' ? '#000000' : '#FFF';

    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.viewWidgetVars = {
          // Create your translating static string variables here
        };
      });
    }
    
    function checkCurrentPage(state){
      if (state.current.name.includes('viewPanel.modulesDetail')) {
        let params = $scope.pageState.current.params;
        $scope.indicator = params.id;
      }
    }

    //map the killchain data to display the details on SVG
    function mapKillChainStagesData(killChainData) {
      const result = Object.keys(killChainData).map(stage => ({
        tag: killchainPhasesService.mapKillChainStageData(stage).tag, //displayName
        count: killChainData[stage],
        id: killchainPhasesService.mapKillChainStageData(stage).id //to be mapped with SVG id
      }));
      return result;
    }

    function checkForSVGLoad() {
      killchainPhasesService.loadSVG($scope.svgPath).then(function (response) {
        $scope.svgContent = $sce.trustAsHtml(response.data);
        $timeout(function () {
          const svgEl = document.querySelector('#svg-container svg');
          if (svgEl) {
            loadedSVGDocument = svgEl;
            svgLoaded = true;
            initializeData();
            if(!$scope.config.resource) {
              attachHoverHandlers();
            }
          }
        }, 0);
      });
    }

    function initializeData() {
      let killchainPhasesTag = [];
      $scope.topKillChainStages.forEach(element => {
        if ($scope.config.moduleType === "Summary Data") {
          addLabelCounts(element);
        }
        addLabel(element);
        if (element.count > 0) {
          killchainPhasesTag.push(element.id)
        }
      });
      if ($scope.config.moduleType === "Highlight Data") {
        fetchKillChainPhases($scope.config.resourceField);
      }
      else {
        highlightKillChainPhases(killchainPhasesTag);
      }
    }

    //map the killchain id to display the kill chain phases count
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
          countDiv.setAttribute('style', 'color: ' + countColor + '; font-weight: bold; font-size: 16px;font-family:' + fontFamily + ';');
        }
        else {
          countDiv.setAttribute('style', 'color: ' + countColor + '; font-weight: bold; font-size: 16px;font-family:' + fontFamily + ';');
        }
        countDiv.innerHTML = element.count;
        labelElem.appendChild(countDiv);
        source.after(labelElem);
    }

    //map the killchain id to display the kill chain phases
    function addLabel(element) {
      var source = loadedSVGDocument.getElementById(element.id + '_Label');
      if($scope.config.resource) {
        const lineEl = loadedSVGDocument.getElementById(`${element.id}_Line`);
        lineEl.style.display = 'none';
      }
      source.setAttribute('style', 'font-family:\'Lato\', sans-serif;');
      let bbox = source.getBBox();
      let x = bbox.x;
      let y = bbox.y - 3;
      if($scope.config.moduleType==="Highlight Data" && y > 150){
        y-= 25; //to show the label nearer to the icons 
      }
      let width = 300;
      let height = bbox.height + 100;
      let labelElem = document.createElementNS(source.namespaceURI, 'foreignObject');
      labelElem.setAttribute('x', x);
      labelElem.setAttribute('y', y);
      labelElem.setAttribute('width', width);
      labelElem.setAttribute('height', height);

      var labelDiv = document.createElement('div');
      labelDiv.setAttribute('class', element.id + '_Label');
      if ($scope.currentTheme === 'light') {
        if($scope.showMetrics) {
          labelDiv.setAttribute('style', 'color: ' + labelColor + '; font-size: 16px; margin-top: -4px; font-family:' + fontFamily + ';');
        }else {
          labelDiv.setAttribute('style', 'color: ' + labelColor + '; font-size: 20px; padding-top: 20px; font-family:' + fontFamily + ';');
        }
      }
      else {
        if($scope.showMetrics) {
          labelDiv.setAttribute('style', 'color: ' + labelColor + '; font-size: 16px; margin-top: -4px; font-family:' + fontFamily + ';');
        }else {
          labelDiv.setAttribute('style', 'color: ' + labelColor + '; font-size: 20px; padding-top: 20px; font-family:' + fontFamily + ';');
        }
      }
      labelDiv.innerHTML = $filter('camelCaseToHuman')(element.tag);
      labelElem.appendChild(labelDiv);
      source.after(labelElem);
    }

    function highlightKillChainPhases(_data){
        _data.forEach(element =>  {
          const parentElementId = loadedSVGDocument.getElementById(element.toLowerCase());
          const parentElementCountId = loadedSVGDocument.getElementById(element.toLowerCase() + '_count');
          if (parentElementId) {
            parentElementId.setAttribute('fill', activeColor);
            parentElementCountId.setAttribute('fill', activeColor);
          }
        });  
    }

    function attachHoverHandlers() {
      $scope.killChainSections.forEach(function (section) {
        const el = loadedSVGDocument.getElementById(section.id);
        const count_el = loadedSVGDocument.getElementById(section.id + '_count');
        const el_Line = loadedSVGDocument.getElementById(section.id + '_Line');
        if (!el) return;
        $scope.svgPhaseElements = $scope.svgPhaseElements || {};
        $scope.svgPhaseElements[section.id] = { el, count_el, el_Line };

        // mouse enter
        el.addEventListener('mouseenter', function () {
          $scope.hoveredPhase = section.id;
          $scope.activePhase = section.id;
          el.setAttribute('fill', activeColor);
          count_el.setAttribute('fill', activeColor);
          el_Line.setAttribute('stroke', activeColor);
          $scope.$applyAsync();
        });

        // mouse leave
        el.addEventListener('mouseleave', function () {
          $scope.hoveredPhase = null;

          // revert only if NOT active
          if (!$scope.activePhases[section.id]) {
            el.setAttribute('fill', defaultFill);
            count_el.setAttribute('fill', defaultFill);
            el_Line.setAttribute('stroke', defaultFill);
          } else {
            el.setAttribute('fill', activeColor);
            count_el.setAttribute('fill', activeColor);
            el_Line.setAttribute('stroke', activeColor);
          }

          $scope.activePhase = null;
          $scope.$applyAsync();
        });

        // mouse click
        el.addEventListener('click', function () {
          const wasActive = !$scope.activePhases[section.id];
          Object.keys($scope.activePhases).forEach(id => {
            const elems = $scope.svgPhaseElements[id];
            if (elems) {
              elems.el.setAttribute('fill', defaultFill);
              elems.count_el.setAttribute('fill', defaultFill);
              elems.el_Line.setAttribute('stroke', defaultFill);
            }
          });
          $scope.activePhases = {};
          $scope.activePhases[section.id] = wasActive;
          el.setAttribute('fill', activeColor);
          count_el.setAttribute('fill', activeColor);
          el_Line.setAttribute('stroke', activeColor);
          $scope.$applyAsync();
       });

      });
    }

    
    function fetchKillChainPhases(_fields){ 
      let moduleMetaData = modelMetadatasService.getMetadataByModuleType($scope.config.resource);
      let _connectorName = moduleMetaData.dataSource.connector;
      let _connectorAction = moduleMetaData.dataSource.operation;
      let payload = { 'indicator': $scope.indicator, 'fields': _fields };
      killchainPhasesService.executeAction(_connectorName, _connectorAction, payload).then(function(response){
        const key = $scope.config.resourceField;
        if(response.data[key] && response.data[key].length > 0){
          highlightKillChainPhases(response.data[key]);
        }
      });
    }

    function getProgressColor(percent) {
      if (percent <= 33) {
        return '#D2AC1A';
      }
      if (percent <= 66) {
        return '#DE7A13';
      }
      return '#e31b1d';
    }

    function init() {
      // To handle backward compatibility for widget
      _handleTranslations();
      checkCurrentPage($scope.pageState);
      $scope.noData = false;
      $scope.showMetrics = $scope.config.showMetrics ? $scope.config.showMetrics : false;
      if ($scope.config.embedded) { //display the data if widget is embedded
        $scope.embedded = true;
      }
      else { //display the data from widget config 
        $scope.embedded = false;
      }
      if($scope.showMetrics) {
        $scope.killChainSections = $scope.config.data;
        $scope.killChainSections.forEach(section => {
          section.progressColor = getProgressColor(section.progressPercent);
        });
      }
      if(!$scope.showMetrics && $scope.config.moduleType==="Summary Data"){ //to map kill chain phases count data
        if($scope.config.killchainDataJson){
          $scope.topKillChainStages = mapKillChainStagesData($scope.config.killchainDataJson);     
        }
        else{
          $scope.noData = true;
        }
      }else{
        $scope.topKillChainStages = mapKillChainStagesData({
          "reconnaissance": 0,
          "weaponization": 0,
          "delivery": 0,
          "exploitation": 0,
          "installation": 0,
          "command-and-control": 0,
          "actions-on-objectives": 0
        }
        );
      }
      setTimeout(() => {
        checkForSVGLoad();
      }, 10);
    }

    init();
  }
})();
