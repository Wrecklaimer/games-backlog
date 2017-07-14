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

	api.deleteGame = function (id) {
		return $http.delete(serviceBase + 'deleteGame?id=' + id);
	};

	return api;
}]);

app.controller('GamesCtrl', ['$scope', 'services', function ($scope, services) {
	$scope.search = {};

	services.getGames().then(function(games) {
		$scope.games = games.data;
	});

	$scope.clearSearch = function() {
		$scope.search = {};
	};
}]);

app.controller('GameCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'services', 'game', function ($scope, $rootScope, $location, $routeParams, services, game) {
	var gameID = $routeParams.id;
	$rootScope.title = (gameID > 0) ? 'Edit Game' : 'Add Game';
	$scope.game = game.data ? game.data : {};
	$scope.releaseDate = parseIsoLocal($scope.game.release_date);

	$scope.dateChanged = function() {
		if (angular.isUndefined($scope.releaseDate))
			return;

		$scope.game.release_date = toIsoString($scope.releaseDate);
	};

	$scope.saveGame = function (game) {
		if (gameID > 0) { // Update existing
			services.updateGame(gameID, game)
			.then(function onSuccess(response) {
				$location.path('/');
			}).catch(function onError(response) {
				console.log(response);
			});
		} else { // Add new
			services.insertGame(game)
			.then(function onSuccess(response) {
				$location.path('/');
			}).catch(function onError(response) {
				console.log(response);
			});
		}
	};

	$scope.deleteGame = function () {
		if (gameID > 0) {
			if (confirm('Are you sure you want to delete game \'' + $scope.game.title + '\'?')) {
				services.deleteGame(gameID)
				.then(function onSuccess(response) {
					$location.path('/');
				}).catch(function onError(response) {});
			}
		}
	};

	function parseIsoLocal(string) {
		if (angular.isUndefined(string))
			return undefined;

		var b = string.split(/\D/);
		return new Date(b[0], b[1]-1, b[2]);
	}

	function toIsoString(date) {
		year = date.getFullYear();
		month = date.getMonth()+1;
		dt = date.getDate();

		if (dt < 10)
			dt = '0' + dt;
		if (month < 10)
			month = '0' + month;

		return (year + '-' + month + '-' + dt);
	}
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