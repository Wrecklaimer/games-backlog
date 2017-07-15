angular.module('gamesBacklogApp').config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			title: 'Games',
			templateUrl: 'app/games/games.html',
			controller: 'GamesCtrl'
		})
		.when('/game/:id', {
			title: 'Game',
			templateUrl: 'app/game/game.html',
			controller: 'GameCtrl',
			resolve: {
				game: function(apiService, $route){
					var id = $route.current.params.id;
					return apiService.getGame(id);
				}
			}
		})
		.otherwise({
			redirectTo: '/'
		});
}]);