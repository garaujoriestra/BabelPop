angular.module("WallapopTFG").controller("detailAdCtrl", ["$scope", "$state", "$auth", "$location", "$translate", "APIClient", "userDataStorage", "addetail", "tagSplitFilter", "states", "errorHandler", "apiPaths", "checkAuth", function($scope, $state, $auth, $location, $translate, APIClient, userDataStorage, addetail, tagSplitFilter, states, errorHandler, apiPaths, checkAuth) {

    // Modelo del detalle del anuncio
    $scope.datos = {};
    $scope.datos = addetail.ad;
    console.log('DETAILLLLLLLLLLL: ',$scope.datos);

    // Función que verifica si es un anuncio favorito
    $scope.isFav = function() {

        // Si el usuario está logueado
        if ($auth.isAuthenticated()) {
            var favAds = userDataStorage.getUserData().favAds;
            var flag = favAds.indexOf($scope.datos._id);
            if (flag < 0) {
                return false;
            } else {
                return true;
            }
        }
    };

    // Función que verifica si el usuario logueado es el dueño del anuncio y además aun está en venta
    $scope.iAmTheOwner = function() {
        if ($auth.isAuthenticated() && $scope.datos.sold === false) {
            $scope.ownerData = userDataStorage.getUserData();
            console.log($scope.datos);
            return $scope.ownerData.userId === $scope.datos.ownerId;
        }
        return false;
    };

    // Función que verifica si el usuario logueado y si no estoy ya en la lista de reservas
    $scope.iAmInReserverList = function() {
        var imReserver = false;
        if ($auth.isAuthenticated() && $scope.datos.sold === false) {
            $scope.ownerData = userDataStorage.getUserData();
            $scope.datos.reservoirList.map(function(u) {
                console.log('UUUUU:', u.userId, $scope.ownerData.userId);
                if (u.userId == $scope.ownerData.userId) {
                    console.log('SON IGUALES: ', u.userId);
                    imReserver = true;
                }
            });
        }
        return imReserver;
    };

    $scope.isSold = function() {
        if($scope.datos && $scope.datos.sold){
            console.log('Esta vendido');
            return true;
        }
        return false;
    }

    // Función que redirige a editar anuncio
    $scope.gotoEditAd = function(ad) {
        userDataStorage.setEditAd(ad);
        $state.go(states.editAd);
    }

    // Función apunta al usuario loggeado a la lista de reservas
    $scope.gotoReserverAd = function(ad) {

        if (checkAuth.isLogged()) {
            var d = new Date();
            d.setDate(d.getDate() + 1);
            var reservoirUserAndDate = {
                user: userDataStorage.getUserName(),
                userId: userDataStorage.getUserId(),
                userReservation: d
            }
            ad["reservoirList"].push(reservoirUserAndDate)
                // Petición al backend para editar anuncio
            APIClient.apiPutRequest(apiPaths.editAdReserver, ad).then(function() {

                // Terminamos carga
                $scope.$emit("stopLoadingState");

                // Redirigimos a la página de anuncios
                $state.go(states.ads);
            }).catch(function(error) {

                // Redirigimos a la página de error pertinente si es necesario
                errorHandler.handle(error, [409]);
                // Terminamos carga
                $scope.$emit("stopLoadingState");
            });
        } else {
            $state.go(states.mainLog);
        }

    }

    // Función que marca un anuncio como favorito
    $scope.iLikeIt = function() {

        // Si el usuario está logueado
        if ($auth.isAuthenticated()) {

            // Tomamos los favoritos del localStorage
            var favAds = userDataStorage.getUserData().favAds;
            favAds = favAds.split(",");

            // Si no es favorito
            if (favAds.indexOf($scope.datos._id) < 0) {

                // Añadimos favorito en el modelo
                favAds.push($scope.datos._id);
                $scope.datos.likes = $scope.datos.likes + 1;
                userDataStorage.setUserfavAds(favAds);

                // Añadimos favorito en el backend
                var ids = { adId: $scope.datos._id, id: userDataStorage.getUserData().userId };
                APIClient.putFavs(ids).then(
                    // Si la petición ha ido correctamente
                    function() {},
                    // Si la petición ha fallado
                    function(error) {
                        // Redigirimos a la página de error pertinente
                        errorHandler.handle(error);
                    }
                );
            }
            // Si es favorito
            else {

                // Eliminamos favorito en el modelo
                favAds.splice(favAds.indexOf($scope.datos._id), 1);
                $scope.datos.likes = $scope.datos.likes - 1;
                userDataStorage.setUserfavAds(favAds);

                // Eliminamos favorito en el backend
                ids = { adId: $scope.datos._id, id: userDataStorage.getUserData().userId };
                APIClient.putFavs(ids).then(
                    // Si la petición ha ido correctamente
                    function() {},
                    // Si la petición ha fallado
                    function(error) {
                        // Redigirimos a la página de error pertinente
                        errorHandler.handle(error);
                    }
                );
            }
        } // Si el usuario no está logueado
        else {
            // Redirige a la página de login
            $state.go(states.mainLogRedirect);
        }
    }

    $scope.shareGoogle = function() {
        var ref = "https://plus.google.com/share?url=" + "en.wallapop.com";

        window.open(ref, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    }
    $scope.shareFacebook = function() {
        var ref = "https://www.facebook.com/sharer/sharer.php?u=" + "en.wallapop.com";

        window.open(ref, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    }
    $scope.shareEmail = function() {
        var subject = "";
        var body = "";

        $translate('SHARE.SUBJECT').then(
            function(translation) {
                subject = translation + $scope.datos.title;
                $translate('SHARE.BODY').then(
                    function(translation) {
                        body = translation + $scope.datos.detail;
                        $translate('SHARE.PRICE').then(
                            function(translation) {
                                body += "%0A%0A" + translation + $scope.datos.price + $scope.datos.badge;
                                $translate('SHARE.LINK').then(
                                    function(translation) {
                                        body += "%0A%0A%0A" + translation + encodeURI($location.absUrl());
                                        window.location.href = "mailto:?" + "subject=" + subject + "&body=" + body;
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    }
    $scope.shareTwitter = function() {
        $translate('SHARE.TWITTER').then(
            function(translation) {
                var ref = "https://twitter.com/home?status=" + translation + $location.protocol() + "://" + $location.host() + "/%23" + $location.path()
                window.open(ref, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
            }
        );

    }
}]);
