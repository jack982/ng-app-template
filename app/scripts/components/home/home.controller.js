'use strict';

angular.module('home.module')

.controller('HomeController', HomeController);

HomeController.$inject = ['$scope', 'homeService'];

function  HomeController($scope, homeService) {
	var cntl = this;
	
	cntl.welcome = homeService.getWelcomeMessage();	
}
