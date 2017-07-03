angular.module("WallapopTFG").controller("customLogLayoutCtrl", ["$scope", "paths", "checkAuth", function($scope, paths,  checkAuth) {

    // Comprueba que el usuario acceda únicamente si NO está logueado
	checkAuth.checkLogged();

}]);
