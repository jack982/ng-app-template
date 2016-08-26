'use strict';

angular.module('home.module')

.controller('HomeController', HomeController);

HomeController.$inject = ['$scope', 'homeService','ENV_VARS'];

function HomeController($scope, homeService, ENV_VARS) {
	var cntl = this;
	
	cntl.welcome = homeService.getWelcomeMessage();	
	
	cntl.version = ENV_VARS.appVersion;
}
