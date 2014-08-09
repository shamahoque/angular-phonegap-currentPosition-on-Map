angular.module('example').factory('CurrentPosition', function($rootScope) {
    return {
        //call for registering to pause & resume service if app in background/foreground
        init: function() {
            var service = this;
            document.addEventListener("pause", function() {
                service.pause();
            }, false);

            document.addEventListener("resume", function() {
                service.start();
            }, false);

        },
        //call to start getting current position and broadcast it to intended controller
        start: function() {
            watchID = navigator.geolocation.watchPosition(function(position) {
                console.log(position);
                $rootScope.$broadcast('positionUpdate', position); //broadcast updated position to controller
            }, function(error) {
                console.log(error);
            }, {
                enableHighAccuracy: true
            });
            store.set('watchID', watchID);
            return watchID;
        },
        //call to stop getting current position
        pause: function() {
            watchID = store.get('watchID');
            if (watchID != null) {
                navigator.geolocation.clearWatch(watchID);
                watchID = null;
                store.set('watchID', watchID);
            }
        },
        //call to add/update current position marker in the passed map at the specified position
        addMarker: function(map, position) {
            var currentLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            currentMarker = new google.maps.Marker({
                map: map,
                position: currentLatlng,
                icon: 'bluedot.gif', //add your own marker image (sample provided)
                optimized: false
            });

            return currentMarker;
        }
    }
});