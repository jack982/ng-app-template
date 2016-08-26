'use strict';

require('../shared/config.js');

angular.module('home.module',
	[
        'ui.router',
        'config.module'
	]
)
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        views: {
          'main': {
            templateUrl: '/app/components/home/home.tpl.html',
            controller: 'HomeController',
            controllerAs: 'ctrl'
          }
        },
        data: { }
      });
  })
;

