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
    let currentDistrict = 'District 1'; // Set this based on user selection

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
                    'stephen_jon_torres', '#e6e6e6',

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
            currentDistrict = `District ${selectedProp}`; // Update current district

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
        map.on('click', 'precincts-layer', function (e) {
            if (e.features.length > 0) {
                const properties = e.features[0].properties;
                console.log(e);

                // Initialize the content with basic precinct information
                let content = `
                    <div style="background-color: white; padding: 5px; border-radius: 2.5px; font-size: 12px; line-height: 1.2;">
                        <h3 class="popup-header" style="margin: 2px 0; font-size: 16px;">Precinct ${properties.precinct || 'N/A'}</h3>
                        <hr style="margin: 5px 0;">
                `;

                // Check if the district is District 1 and append candidate percentages
                if (currentDistrict === 'District 1') {
                    content += `
                        <p class="popup-text" style="margin: 2px 0;">Sherman D'Silva: ${properties['sherman_d\'silva_p']}% (${properties['sherman_d\'silva']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Marjan Philhour: ${properties['marjan_philhour_p']}% (${properties['marjan_philhour']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Connie Chan: ${properties['connie_chan_p']}% (${properties['connie_chan']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Jeremiah Boehner: ${properties['jeremiah_boehner_p']}% (${properties['jeremiah_boehner']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Jen Nossokoff: ${properties['jen_nossokoff_p']}% (${properties['jen_nossokoff']})</p>
                    `;
                }
                // Check if the district is District 3 and append candidate percentages
                else if (currentDistrict === 'District 3') {
                    content += `
                        <p class="popup-text" style="margin: 2px 0;">Sharon Lai: ${properties['sharon_lai_p']}% (${properties['sharon_lai']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Moe Jamil: ${properties['moe_jamil_p']}% (${properties['moe_jamil']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Wendy Ha Chau: ${properties['wendy_ha_chau_p']}% (${properties['wendy_ha_chau']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Eduard Navarro: ${properties['eduard_navarro_p']}% (${properties['eduard_navarro']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Danny Sauter: ${properties['danny_sauter_p']}% (${properties['danny_sauter']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Matthew Susk: ${properties['matthew_susk_p']}% (${properties['matthew_susk']})</p>
                    `;
                }
                // Check if the district is District 5 and append candidate percentages
                else if (currentDistrict === 'District 5') {
                    content += `
                        <p class="popup-text" style="margin: 2px 0;">Autumn Hope Looijen: ${properties['autumn_hope_looijen_p']}% (${properties['autumn_hope_looijen']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Bilal Mahmood: ${properties['bilal_mahmood_p']}% (${properties['biden_mahmood']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Scotty Jacobs: ${properties['scotty_jacobs_p']}% (${properties['scotty_jacobs']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Allen Jones: ${properties['allen_jones_p']}% (${properties['allen_jones']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Dean Preston: ${properties['dean_preston_p']}% (${properties['dean_preston']})</p>
                    `;
                }

                // Check if the district is District 5 and append candidate percentages
                else if (currentDistrict === 'District 7') {
                    content += `
                        <p class="popup-text" style="margin: 2px 0;">Myrna Melgar: ${properties['myrna_melgar_p']}% (${properties['myrna_melgar']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Matt Boschetto: ${properties['matt_boschetto_p']}% (${properties['matt_boschetto']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Stephen Martin-Pinto: ${properties['stephen_martin-pinto_p']}% (${properties['stephen_martin-pinto']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Edward S. Yee: ${properties['edward_s_yee_p']}% (${properties['edward_s_yee']})</p>
                    `;
                }

                // Check if the district is District 9 and append candidate percentages
                else if (currentDistrict === 'District 9') {
                    content += `
                        <p class="popup-text" style="margin: 2px 0;">Jackie Fielder: ${properties['jackie_fielder_p']}% (${properties['jackie_fielder']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Stephen Torres: ${properties['stephen_jon_torres_p']}% (${properties['stephen_jon_torres']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Roberto Hernandez: ${properties['roberto_hernandez_p']}% (${properties['roberto_hernandez']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Jaime Gutierrez: ${properties['jaime_gutierrez_p']}% (${properties['jaime_gutierrez']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Trevor Chandler: ${properties['trevor_chandler_p']}% (${properties['trevor_chandler']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Julian Bermudez: ${properties['julian_bermudez_p']}% (${properties['julian_bermudez']})</p>
                        <p class="popup-text" style="margin: 2px 0;">H. Brown: ${properties['h_brown_p']}% (${properties['h_brown']})</p>
                    `;
                }

                // Check if the district is District 11 and append candidate percentages
                else if (currentDistrict === 'District 11') {
                    content += `
                        <p class="popup-text" style="margin: 2px 0;">Oscar Flores: ${properties['oscar_flores_p']}% (${properties['oscar_flores']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Michael Lai: ${properties['michael_lai_p']}% (${properties['michael_lai']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Roger Marenco: ${properties['roger_k_marenco_p']}% (${properties['roger_k_marenco']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Jose Morales: ${properties['jose_morales_p']}% (${properties['jose_morales']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Ernest EJ Jones: ${properties['ernest_ej_jones_p']}% (${properties['ernest_ej_jones']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Adlah Chisti: ${properties['adlah_chisti_p']}% (${properties['adlah_chisti']})</p>
                        <p class="popup-text" style="margin: 2px 0;">Chyanne Chen: ${properties['chyanne_chen_p']}% (${properties['chyanne_chen']})</p>
                    `;
                }

                content += '</div>'; // Close the content div


                // Close the current popup if it exists
                if (currentPopup) {
                    currentPopup.remove();
                }

                // Create and add the new popup
                currentPopup = new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(content)
                    .addTo(map);
            } else {
                console.warn("No features found at clicked location.");
            }
        });



        // Resize the map when the window is resized
        window.addEventListener('resize', () => {
            map.resize();
        });

        // Send the map data to Pym.js for responsive design
        pymChild.sendHeight();
    });
});
