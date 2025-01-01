/* Copyright start
    MIT License
    Copyright (c) 2024 Fortinet Inc
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
          return {'tag': 'Reconnaissance', 'id': 'recon' };
          break;
        case 'weaponization':
          return {'tag': 'Weaponization', 'id': 'weaponize'};
          break;
        case 'delivery':
          return {'tag': 'Delivery', 'id': 'deliver'};
          break;
        case 'exploitation':
          return {'tag': 'Exploitation', 'id': 'exploit'};
          break;
        case 'installation':
          return {'tag': 'Installation', 'id': 'install'};
          break;
        case 'execute':
          return {'tag': 'Installation', 'id': 'install'};
          break;
        case 'command-and-control':
          return {'tag': 'Command & Control', 'id': 'control'};
        case 'post-infection':
          return {'tag': 'Actions', 'id': 'actions'};
          break;
        case 'postinfection':
          return {'tag': 'Actions', 'id': 'actions'};
          break;
        case 'actions':
          return {'tag': 'Actions', 'id': 'actions'};
          break;
        case 'unknown':
        default:
          return {'tag': '', 'id': ''};

      }
    }

  return service;
  }
})();
