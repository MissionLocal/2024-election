document.addEventListener('DOMContentLoaded', function () {
    // Initialize the Pym.js child
    var pymChild = new pym.Child();
    // Define access token
    mapboxgl.accessToken = "pk.eyJ1IjoibWxub3ciLCJhIjoiY2t0dnZwcm1mMmR5YzMycDNrcDZtemRybyJ9.Br-G0LTOB3M6w83Az4XGtQ";

    // Define basemap settings
    let mapZoom = window.innerWidth < 400 ? 12.48 : 12.48;
    let mapY = window.innerWidth < 400 ? 37.781 : 37.781;

    // Initialize the map
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mlnow/cm2tndow500co01pw3fho5d21',
        zoom: mapZoom,
        center: [-122.481, mapY],
        minZoom: 10.4
    });

    let currentPopup; // Variable to hold the current popup reference

    // Map load event
    map.on('load', () => {
        // Load initial district data
        map.addSource('precincts', {
            'type': 'geojson',
            'data': "/data/1.geojson"
        });

        map.addLayer({
            'id': 'precincts-layer',
            'type': 'fill',
            'source': 'precincts',
            'paint': {
                'fill-color': [
                    'match',
                    ['get', 'winner'],

                    // District 1
                    'sherman_d\'silva', '#efbe25',
                    'jen_nossokoff', '#57a4ea',
                    'jeremiah_boehner', '#46c134',
                    'connie_chan', '#ed43e5',
                    'marjan_philhour', '#65ead0',

                    // District 3
                    'moe_jamil', '#d896ff',
                    'eduard_navarro', '#efbe25',
                    'sharon_lai', '#ed43e5',
                    'wendy_ha_chau', '#57a4ea',
                    'matthew_susk', '#46c134',
                    'danny_sauter', '#65ead0',

                    // District 5
                    'dean_preston', '#d896ff',
                    'scotty_jacobs', '#efbe25',
                    'allen_jones', '#57a4ea',
                    'autumn_hope_looijen', '#ed43e5',
                    'bilal_mahmood', '#46c134',

                    // District 7
                    'myrna_melgar', '#65ead0',
                    'stephen_martin-pinto', '#d896ff',
                    'matt_boschetto', '#efbe25',
                    'edward_s_yee', '#57a4ea',

                    // District 9
                    'jackie_fielder', '#ed43e5',
                    'julian_bermudez', '#46c134',
                    'jaime_gutierrez', '#65ead0',
                    'h_brown', '#d896ff',
                    'roberto_hernandez', '#efbe25',
                    'trevor_chandler', '#57a4ea',

                    // District 11
                    'roger_k_marenco', '#ed43e5',
                    'jose_morales', '#46c134',
                    'michael_lai', '#65ead0',
                    'oscar_flores', '#d896ff',
                    'adlah_chisti', '#efbe25',
                    'chyanne_chen', '#57a4ea',
                    'ernest_ej_jones', '#e6e6e6', // Remaining color

                    // Default color for unmatched names
                    '#CECECE'
                ],
                'fill-opacity': 0.6
            }
        });


        // Add a base outline for the precincts
        map.addLayer({
            'id': 'precincts-outline',
            'type': 'line',
            'source': 'precincts',
            'paint': {
                'line-color': '#ffffff',
                'line-width': 0.5
            }
        });

        // Add hover outline layer for highlighted polygons
        map.addLayer({
            'id': 'precincts-hover-outline',
            'type': 'line',
            'source': 'precincts',
            'paint': {
                'line-color': '#ffffff',
                'line-width': 2.5
            },
            'filter': ['==', ['get', 'precinct'], '']
        });

        // Hover event listeners
        map.on('mousemove', 'precincts-layer', (e) => {
            if (e.features.length > 0) {
                map.getCanvas().style.cursor = 'pointer';
                const featurePrecinct = e.features[0].properties.precinct;
                map.setFilter('precincts-hover-outline', ['==', ['get', 'precinct'], featurePrecinct]);
            }
        });

        map.on('mouseleave', 'precincts-layer', () => {
            map.getCanvas().style.cursor = '';
            map.setFilter('precincts-hover-outline', ['==', ['get', 'precinct'], '']);
        });

        // Dropdown for updating districts
        document.getElementById('propositionDropdown').addEventListener('change', (event) => {
            const selectedProp = event.target.value;

            // Map data URL based on selection
            const dataUrl = `data/${selectedProp}.geojson`;

            // Remove any existing popups
            if (currentPopup) {
                currentPopup.remove();
                currentPopup = null;
            }

            // Update the precinct data based on selected district
            map.getSource('precincts').setData(dataUrl);

            // Define center and zoom levels for each district
            let center, zoom;
            switch (selectedProp) {
                case '1':
                    center = [-122.481, 37.781];  // Coordinates for District 1
                    zoom = 12.48;
                    break;
                case '3':
                    center = [-122.408, 37.798];  // Coordinates for District 3
                    zoom = 13.06;
                    break;
                case '5':
                    center = [-122.434, 37.778];  // Coordinates for District 5
                    zoom = 12.8;
                    break;
                case '7':
                    center = [-122.472, 37.740];  // Coordinates for District 7
                    zoom = 12;
                    break;
                case '9':
                    center = [-122.414, 37.744];  // Coordinates for District 9
                    zoom = 12.25;
                    break;
                case '11':
                    center = [-122.444, 37.722];  // Coordinates for District 11
                    zoom = 12.5;
                    break;
                default:
                    center = [-122.429, 37.77];   // Default coordinates
                    zoom = 10.5;
                    break;
            }

            // Update the map's center and zoom
            map.flyTo({
                center: center,
                zoom: zoom,
                essential: true // This ensures the transition is smooth
            });

            // Hide all legends
            document.querySelectorAll('.legend').forEach(legend => {
                legend.style.display = 'none';
            });

            // Show the selected legend
            const selectedLegend = document.getElementById(`legend-district${selectedProp}`);
            if (selectedLegend) {
                selectedLegend.style.display = 'block';
            }
        });



        // Bring specific labels to the front
        map.moveLayer('road-label-navigation');
        map.moveLayer('settlement-subdivision-label');

        // Resize iframe when charts are drawn
        pymChild.sendHeight();
    });

});
