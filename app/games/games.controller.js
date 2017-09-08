angular.module('app.controllers').controller('GamesCtrl', ['$scope', 'apiService',
	function ($scope, apiService) {
	$scope.sort = {
		type: 'release_date',
		reverse: false
	};
	$scope.hideFinished = false;
	$scope.search = {};

	apiService.getGames().then(function(games) {
		$scope.games = games.data;
	});

	$scope.filterGames = function(item) {
		var matchTitle = true;
		var matchStatus = true;

		if ($scope.search.title)
			matchTitle = item.title.toLowerCase().includes($scope.search.title.toLowerCase());
		
		if ($scope.hideFinished)
			matchStatus = item.game_status !== 'Finished';

		return matchTitle && matchStatus;
	};

	$scope.clearSearch = function() {
		$scope.search = {};
	};

	$scope.sortBy = function(type) {
		// Sorting by the same type again will simply reverse the order
		if ($scope.sort.type === type) {
			$scope.sort.reverse = !$scope.sort.reverse;
			return;
		}

		$scope.sort.type = type;
		$scope.sort.reverse = false;
	};
}]);