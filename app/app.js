var app = angular.module('gamesBacklogApp', [
	'ngRoute',
	'app.services',
	'app.controllers'
	]);

app.run(['$location', '$rootScope', function($location, $rootScope) {
	$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
		$rootScope.title = current.$$route.title;
	});
}]);

var appServices = angular.module('app.services', []);
var appControllers = angular.module('app.controllers', []);