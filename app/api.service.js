angular.module('app.services').service('apiService', function($http) {
	var apiBase = 'api/';

	this.getGames = function() {
		return $http.get(apiBase + 'games');
	};

	this.getGame = function (id) {
		return $http.get(apiBase + 'game?id=' + id);
	};

	this.insertGame = function (game) {
		return $http.post(apiBase + 'insertGame', {game:game});
	};

	this.updateGame = function (id, game) {
		return $http.post(apiBase + 'updateGame', {id:id, game:game});
	};

	this.deleteGame = function (id) {
		return $http.delete(apiBase + 'deleteGame?id=' + id);
	};
});