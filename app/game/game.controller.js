angular.module('app.controllers').controller('GameCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'apiService', 'game',
	function ($scope, $rootScope, $location, $routeParams, apiService, game) {
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
			apiService.updateGame(gameID, game)
			.then(function onSuccess(response) {
				$location.path('/');
			}).catch(function onError(response) {
				console.log(response);
			});
		} else { // Add new
			apiService.insertGame(game)
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
				apiService.deleteGame(gameID)
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