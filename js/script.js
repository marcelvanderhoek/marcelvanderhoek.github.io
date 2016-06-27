(function() {
'use strict';

/**
* Globals, selectors
*/
var map, marker;

// Standaard locatie voor init
var standaardLocatie = {
    lat: 51.930187,
    lng: 4.642837
};

var knop = document.getElementById('zoekop');
var invoer = document.getElementById('invoer');
var mapdiv = document.getElementById('map');

/**
* Methods
*/
function converteerNaarLengteBreedte(x, y) {
    // Converteert Rijksdriehoekscoördinaten naar lengte- en breedtegraden voor Maps (WGS84)
    // Bronfunctie in C#: https://www.roelvanlisdonk.nl/?p=2950

    // Gebruik Amersfoort als referentiepunt
    var referentieRdX = 155000;
    var referentieRdY = 463000;
    var referentieWgs84X = 52.15517;
    var referentieWgs84Y = 5.387206;

    var dX = (x - referentieRdX) * (Math.pow(10,-5));
    var dY = (y - referentieRdY) * (Math.pow(10,-5));

    var somN =
        (3235.65389 * dY) +
        (-32.58297 * Math.pow(dX, 2)) +
        (-0.2475 * Math.pow(dY, 2)) +
        (-0.84978 * Math.pow(dX, 2) * dY) +
        (-0.0655 * Math.pow(dY, 3)) +
        (-0.01709 * Math.pow(dX, 2) * Math.pow(dY, 2)) +
        (-0.00738 * dX) +
        (0.0053 * Math.pow(dX, 4)) +
        (-0.00039 * Math.pow(dX, 2) * Math.pow(dY, 3)) +
        (0.00033 * Math.pow(dX, 4) * dY) +
        (-0.00012 * dX * dY);

    var somO =
        (5260.52916 * dX) +
        (105.94684 * dX * dY) +
        (2.45656 * dX * Math.pow(dY, 2)) +
        (-0.81885 * Math.pow(dX, 3)) +
        (0.05594 * dX * Math.pow(dY, 3)) +
        (-0.05607 * Math.pow(dX, 3) * dY) +
        (0.01199 * dY) +
        (-0.00256 * Math.pow(dX, 3) * Math.pow(dY, 2)) +
        (0.00128 * dX * Math.pow(dY, 4)) +
        (0.00022 * Math.pow(dY, 2)) +
        (-0.00022 * Math.pow(dX, 2)) +
        (0.00026 * Math.pow(dX, 5));

    var breedte = referentieWgs84X + (somN / 3600);
    var lengte = referentieWgs84Y + (somO / 3600);

    return {
        lat: breedte,
        lng: lengte
    };
}

function initMap(lengteBreedte) {
    map = new google.maps.Map(mapdiv, {
        center: lengteBreedte,
        zoom: 15,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
        }
    });

    marker = new google.maps.Marker({
        position: lengteBreedte,
        map: map
    });

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(invoer);
    
    // Wacht met weergeven van invoer tot kaart geladen is
    google.maps.event.addListener(map, 'tilesloaded', function() {
        invoer.style.display = 'block';
    });
}

function updateLocatie(e) {
    e.preventDefault();
    var x = document.getElementById('x').value;
    var y = document.getElementById('y').value;
    
    // Laad nieuwe locatie als waarden zich binnen geldige range bevinden
    if(x >= -7000 && x <= 300000 && y >= 289000 && y <= 629000) {
        var nieuweLocatie = converteerNaarLengteBreedte(x,y);
        map.setCenter(nieuweLocatie);
        marker.setPosition(nieuweLocatie);
    }
}

// https://developers.google.com/maps/documentation/javascript/basics
function detectBrowser() {
    var useragent = navigator.userAgent;

    if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
        mapdiv.style.width = '100%';
        mapdiv.style.height = '100%';
    } else {
        mapdiv.style.width = '600px';
        mapdiv.style.height = '600px';
    }
}

/**
* Event listeners, init
*/
knop.addEventListener('click', updateLocatie, false);

window.onload = function() {
    detectBrowser();
    initMap(standaardLocatie);
};

}());