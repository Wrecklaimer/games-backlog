var app = angular.module('gamesBacklogApp', ['ngRoute']);

app.factory('services', ['$http', function($http) {
	var serviceBase = 'services/';
	var api = {};

	api.getGames = function() {
		return $http.get(serviceBase + 'games');
	};

	return api;
}]);

app.controller('GamesCtrl', ['$scope', 'services', function ($scope, services) {
	services.getGames().then(function(games) {
		$scope.games = games.data;
	});
}]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			title: 'Games',
			templateUrl: 'app/partials/games.html',
			controller: 'GamesCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);

app.run(['$location', '$rootScope', function($location, $rootScope) {
	$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
		$rootScope.title = current.$$route.title;
	});
}]);