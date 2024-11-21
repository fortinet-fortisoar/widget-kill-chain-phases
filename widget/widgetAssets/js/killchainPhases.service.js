/* Copyright start 
Copyright (C) 2008 - 2024 Fortinet Inc.
All rights reserved.
FORTINET CONFIDENTIAL & FORTINET PROPRIETARY SOURCE CODE
Copyright end */
'use strict';

(function () {
  angular
    .module('cybersponse')
    .factory('killchainPhasesService', killchainPhasesService);

  killchainPhasesService.$inject = ['$q', '$http', 'API', 'connectorService', '$resource'];

  function killchainPhasesService($q, $http, API, connectorService, $resource) {
    var service;

    service = {
      mapKillChainStageData: mapKillChainStageData
    };

    function mapKillChainStageData(stage) {
      if (typeof stage != 'string') {
        return '';
      }
      switch (stage.toLowerCase().trim()) {
        case 'reconnaissance':
          return {'tag': 'Reconnaissance', 'color': 'yellow', 'icon':'fa fa-binoculars', 'id': 'recon' };
          break;
        case 'weaponization':
          return {'tag': 'Weaponization', 'color': 'yellow', 'icon':'fa fa-mic', 'id': 'weaponize'};
          break;
        case 'delivery':
          return {'tag': 'Delivery', 'color': 'yellow', 'icon':'fa fa-mic', 'id': 'deliver'};
          break;
        case 'exploitation':
          return {'tag': 'Exploitation', 'color': 'orange', 'icon':'fa fa-mic', 'id': 'exploit'};
          break;
        case 'installation':
          return {'tag': 'Installation', 'color': 'orange', 'icon':'fa fa-download', 'id': 'install'};
          break;
        case 'execute':
          return {'tag': 'Installation', 'color': 'orange', 'icon':'fa fa-download', 'id': 'install'};
          break;
        case 'command-and-control':
          return {'tag': 'Command & Control', 'color': 'red', 'icon':'fa fa-laptop', 'id': 'control'};
        case 'post-infection':
          return {'tag': 'Actions', 'color': 'red', 'icon':'fa fa-mic', 'id': 'actions'};
          break;
        case 'postinfection':
          return {'tag': 'Actions', 'color': 'red', 'icon':'fa fa-mic', 'id': 'actions'};
          break;
        case 'actions':
          return {'tag': 'Actions', 'color': 'red', 'icon':'fa fa-mic', 'id': 'actions'};
          break;
        case 'unknown':
        default:
          return {'tag': '', 'color': '', 'icon':'', 'id': ''};

      }
    }

  return service;
  }
})();
