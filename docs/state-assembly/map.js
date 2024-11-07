document.addEventListener('DOMContentLoaded', function () {
    // Initialize the Pym.js child
    var pymChild = new pym.Child();
    // define access token
    mapboxgl.accessToken = "pk.eyJ1IjoibWxub3ciLCJhIjoiY2t0dnZwcm1mMmR5YzMycDNrcDZtemRybyJ9.Br-G0LTOB3M6w83Az4XGtQ";

    // define basemap
    if (window.innerWidth < 400) {
        var mapZoom = 10.4;
        var mapY = 37.771;
    } else {
        var mapZoom = 11.1;
        var mapY = 37.77;
    }

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mlnow/cm2tndow500co01pw3fho5d21',
        zoom: mapZoom,
        center: [-122.429, mapY],
        minZoom: 10.4 // Set minimum zoom level
    });

    let currentPopup; // Variable to hold the current popup reference

    map.on('load', () => {
        // Add GeoJSON data source
        map.addSource('precincts', {
            'type': 'geojson',
            'data': 'data/17.geojson' // Replace with your data file or object
        });

        // Add a layer to style precinct polygons based on yes_perc_bin
        map.addLayer({
            'id': 'precincts-layer',
            'type': 'fill',
            'source': 'precincts',
            'paint': {
                'fill-color': [
                    'match',
                    ['get', 'winner'],
                    'matt_haney', '#65ead0',
                    'manuel_noris-barrera', '#efbe25',

                    'catherine_stefani', '#d896ff',
                    'david_e_lee', '#46c134',

                    '#d3d3d3'
                ],
                'fill-opacity': 0.6
            }
        });

        document.getElementById('propositionDropdown').addEventListener('change', (event) => {
            const selectedProp = event.target.value;
            const dataUrl = `data/${selectedProp}.geojson`; // Update with the correct path to your GeoJSON files

            // Close the current popup if it exists
            if (currentPopup) {
                currentPopup.remove();
                currentPopup = null; // Reset the popup reference
            }

            // Update the precincts source data to the new file based on the selected proposition
            map.getSource('precincts').setData(dataUrl);

            // // Hide all legends first
            // const legends = document.querySelectorAll('.legend');
            // legends.forEach(legend => {
            //     legend.style.display = 'none';
            // });

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
                'line-color': '#ffffff', // Highlight color
                'line-width': 2.5, // Increased line width for hover
            },
            'filter': ['==', ['get', 'precinct'], ''] // Initially hidden
        });

        // Add hover event listeners
        map.on('mousemove', 'precincts-layer', (e) => {
            if (e.features.length > 0) {
                map.getCanvas().style.cursor = 'pointer';

                // Obtain the feature's precinct property
                const featurePrecinct = e.features[0].properties.precinct;

                // Update the filter in the hover-outline layer to highlight the precinct
                map.setFilter('precincts-hover-outline', ['==', ['get', 'precinct'], featurePrecinct]);
            }
        });

        map.on('mouseleave', 'precincts-layer', () => {
            map.getCanvas().style.cursor = '';
            // Reset the hover filter to hide the outline
            map.setFilter('precincts-hover-outline', ['==', ['get', 'precinct'], '']);
        });

        // Once the charts are drawn, call pymChild.sendHeight() to resize the iframe
        pymChild.sendHeight();
    });

    map.on('click', 'precincts-layer', function (e) {
        if (e.features.length > 0) {
            const properties = e.features[0].properties;

            const content17 = `
                <div style="background-color: white; padding: 5px; border-radius: 2.5px; font-size: 12px; line-height: 1.2;">
                    <h3 class="popup-header" style="margin: 2px 0; font-size: 16px;">Precinct ${properties.precinct || 'N/A'}</h3>
                    <p class="popup-text" style="margin: 2px 0;">${properties.registered_voters} voters, ${properties.total_votes || 'N/A'} votes cast</p>
                    <hr style="margin: 5px 0;">
                    <p class="popup-text strong" style="margin: 2px 0;">${properties.candidate_1_name}: ${properties.candidate_1_p || 'N/A'}% (${properties.candidate_1})</p>
                    <p class="popup-text strong" style="margin: 2px 0;">${properties.candidate_2_name}: ${properties.candidate_2_p || 'N/A'}% (${properties.candidate_2})</p>
                </div>
            `;


            // Close the current popup if it exists
            if (currentPopup) {
                currentPopup.remove();
            }

            currentPopup = new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(content17)
                .addTo(map);
        } else {
            console.warn("No features found at clicked location.");
        }
    });

    map.on('load', function () {
        // Move the 'settlement-subdivision-label' layer to the front
        map.moveLayer('road-label-navigation');
        map.moveLayer('settlement-subdivision-label');
    });
});
