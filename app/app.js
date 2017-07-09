var app = angular.module('gamesBacklogApp', ['ngRoute']);

app.factory('services', ['$http', function($http) {
	var serviceBase = 'services/';
	var api = {};

	api.getGames = function() {
		return $http.get(serviceBase + 'games');
	};

	api.getGame = function (id) {
		return $http.get(serviceBase + 'game?id=' + id);
	};

	api.insertGame = function (game) {
		return $http.post(serviceBase + 'insertGame', {game:game});
	};

	api.updateGame = function (id, game) {
		return $http.post(serviceBase + 'updateGame', {id:id, game:game});
	};

	return api;
}]);

app.controller('GamesCtrl', ['$scope', 'services', function ($scope, services) {
	services.getGames().then(function(games) {
		$scope.games = games.data;
	});
}]);

app.controller('GameCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'services', 'game', function ($scope, $rootScope, $location, $routeParams, services, game) {
	var gameID = $routeParams.id;
	$rootScope.title = (gameID > 0) ? 'Edit Game' : 'Add Game';
	var original = game.data;
	original.game_id = gameID;
	$scope.game = angular.copy(original);
	$scope.game.game_id = gameID;

	$scope.isClean = function() {
		return angular.equals(original, $scope.game);
	};

	$scope.saveGame = function (game) {
		if (gameID > 0) { // Update existing
			services.updateGame(gameID, game)
			.success(function (data) {
				$location.path('/');
			});
		} else { // Add new
			services.insertGame(game)
			.success(function (data) {
				$location.path('/');
			});
		}
	};
}]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			title: 'Games',
			templateUrl: 'app/partials/games.html',
			controller: 'GamesCtrl'
		})
		.when('/game/:id', {
			title: 'Game',
			templateUrl: 'app/partials/game.html',
			controller: 'GameCtrl',
			resolve: {
				game: function(services, $route){
					var id = $route.current.params.id;
					return services.getGame(id);
				}
			}
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