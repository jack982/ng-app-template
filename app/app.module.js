/**
 * Created by jpenazzi on 24/08/2016.
 */
'use strict';

require('./components/home/home.module.js');
require('./components/home/home.controller.js');
require('./components/home/home.service.js');

angular.module('app', [
      'ui.router',
      'home.module'
])
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('home');
});