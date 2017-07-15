angular.module('app.services').service('apiService', function($http) {
	var serviceBase = 'services/';

	this.getGames = function() {
		return $http.get(serviceBase + 'games');
	};

	this.getGame = function (id) {
		return $http.get(serviceBase + 'game?id=' + id);
	};

	this.insertGame = function (game) {
		return $http.post(serviceBase + 'insertGame', {game:game});
	};

	this.updateGame = function (id, game) {
		return $http.post(serviceBase + 'updateGame', {id:id, game:game});
	};

	this.deleteGame = function (id) {
		return $http.delete(serviceBase + 'deleteGame?id=' + id);
	};
});