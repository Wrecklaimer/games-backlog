angular.module('app.controllers').controller('GamesCtrl', ['$scope', 'apiService',
	function ($scope, apiService) {
	$scope.sort = {
		type: 'release_date',
		reverse: false
	};
	$scope.search = {};

	apiService.getGames().then(function(games) {
		$scope.games = games.data;
	});

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