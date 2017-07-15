angular.module('app.controllers').controller('GamesCtrl', ['$scope', 'apiService',
	function ($scope, apiService) {
	$scope.search = {};

	apiService.getGames().then(function(games) {
		$scope.games = games.data;
	});

	$scope.clearSearch = function() {
		$scope.search = {};
	};
}]);