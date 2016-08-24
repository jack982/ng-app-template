'use strict';

angular.module('home.module', 
	[
        'ui.router'
	]
)
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        views: {
          'main': {
            templateUrl: 'scripts/components/home/home.tpl.html',
            controller: 'HomeController',
            controllerAs: 'ctrl'
          }
        },
        data: { }
      });
  })
;

