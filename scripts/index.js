// function getLocationCoordinates {

// }

// Adds google map with sample pins
function initMap() {

    let broadway = {
        info: '<strong>Chipotle on Broadway</strong><br>\
                    5224 N Broadway St<br> Chicago, IL 60640<br>',
        lat: 41.976816,
        long: -87.659916
    };

    let belmont = {
        info: '<strong>Chipotle on Belmont</strong><br>\
                    1025 W Belmont Ave<br> Chicago, IL 60657<br>',
        lat: 41.939670,
        long: -87.655167
    };

    let sheridan = {
        info: '<strong>Chipotle on Sheridan</strong><br>\r\
                    6600 N Sheridan Rd<br> Chicago, IL 60626<br>',
        lat: 42.002707,
        long: -87.661236
    };

    let locations = [
        [broadway.lat, broadway.long, 0],
        [broadway.info, broadway.lat, broadway.long, 0],
        [belmont.info, belmont.lat, belmont.long, 1],
        [sheridan.info, sheridan.lat, sheridan.long, 2],
    ];

    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: new google.maps.LatLng(41.976816, -87.659916),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    let infowindow = new google.maps.InfoWindow({});

    let marker, i;

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
        });

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
}