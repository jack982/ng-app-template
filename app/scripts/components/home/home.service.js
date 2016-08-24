'use strict';

angular.module('home.module')

.service('homeService', HomeService);

HomeService.$inject = [];

function HomeService() {
	return {
		'getWelcomeMessage' : function() {
			return "Welcome to your new Angular application!";
		}
	}
}