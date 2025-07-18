document.addEventListener('DOMContentLoaded', function () {
    // Initialize the Pym.js child
    var pymChild = new pym.Child();

    // Define access token
    mapboxgl.accessToken = "pk.eyJ1IjoibWxub3ciLCJhIjoiY21kODJzdWZnMHFqMzJtb2tqc20wOXY2NyJ9.oeZTOKB57oX-95RuV-bkaQ";

    // Define basemap parameters
    const mapZoom = window.innerWidth < 400 ? 10.4 : 11.1;
    const mapY = window.innerWidth < 400 ? 37.771 : 37.77;

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mlnow/cm2tndow500co01pw3fho5d21',
        zoom: mapZoom,
        center: [-122.429, mapY],
        minZoom: 10.4
    });

    let currentPopup; // Variable to hold the current popup reference

    map.on('load', () => {
        // Add GeoJSON data source
        map.addSource('precincts', {
            'type': 'geojson',
            'data': 'data/mayor.geojson' // Static data file
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
                    'london_breed', '#cccccc',
                    'daniel_lurie', '#efbe25',
                    'mark_farrell', '#cccccc',
                    'ahsha_safaí_', '#cccccc',
                    'aaron_peskin', '#cccccc',
                    /* Default color for cases without a match */
                    '#cccccc' // Light grey as default
                ],
                'fill-opacity': 0.6
            }
        });

        map.addLayer({
            'id': 'asian',
            'type': 'line',
            'source': {
                'type': 'geojson',
                'data': 'data/clipped-asian36.geojson'
            },
            'paint': {
                'line-color': '#666666',
                'line-width': 0.7,
            }
        }, 'water')

        // // Add a base outline for the precincts
        // map.addLayer({
        //     'id': 'precincts-outline',
        //     'type': 'line',
        //     'source': 'precincts',
        //     'paint': {
        //         'line-color': '#ffffff',
        //         'line-width': 0.5
        //     }
        // });

        // Add hover outline layer for highlighted polygons
        map.addLayer({
            'id': 'precincts-hover-outline',
            'type': 'line',
            'source': 'precincts',
            'paint': {
                'line-color': '#ffffff',
                'line-width': 2.5,
            },
            'filter': ['==', ['get', 'precinct'], ''] // Initially hidden
        });

        map.moveLayer('asian')



        // Add hover event listeners
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

        // Once the charts are drawn, call pymChild.sendHeight() to resize the iframe
        pymChild.sendHeight();
    });

    map.on('click', 'precincts-layer', function (e) {
        if (e.features.length > 0) {
            const properties = e.features[0].properties;
    
            // Retrieve both percentages and raw vote counts for each candidate
            const candidates = {
                'London Breed': {
                    percentage: properties.london_breed_p || 0,
                    votes: properties.london_breed || 0
                },
                'Mark Farrell': {
                    percentage: properties.mark_farrell_p || 0,
                    votes: properties.mark_farrell || 0
                },
                'Daniel Lurie': {
                    percentage: properties.daniel_lurie_p || 0,
                    votes: properties.daniel_lurie || 0
                },
                'Aaron Peskin': {
                    percentage: properties.aaron_peskin_p || 0,
                    votes: properties.aaron_peskin || 0
                },
                'Ahsha Safaí': {
                    percentage: properties.ahsha_safaí__p || 0,
                    votes: properties.ahsha_safaí_ || 0
                }
               
            };
    
            // Find the candidate with the highest percentage
            const highestCandidate = Object.keys(candidates).reduce((a, b) =>
                candidates[a].percentage > candidates[b].percentage ? a : b
            );
    
            // Construct the popup content, highlighting the highest percentage
            let content = `
                <div style="background-color: white; padding: 5px; border-radius: 2.5px; font-size: 12px; line-height: 1.2;">
                    <h3 class="popup-header" style="margin: 2px 0; font-size: 16px;">Precinct ${properties.precinct || 'N/A'}</h3>
                    <p class="popup-text" style="margin: 2px 0;">${properties.registered_voters} voters</p>
                    <hr>
            `;
    
            // Add each candidate's percentage and vote count in a <p> tag with popup-text class, highlighting the highest one
            Object.keys(candidates).forEach(candidate => {
                const isHighest = candidate === highestCandidate;
                const { percentage, votes } = candidates[candidate];
                content += `
                    <p class="popup-text" style="margin: 2px 0; ${isHighest ? 'font-weight: bold;' : ''}">
                        ${candidate}: ${percentage}% (${votes} votes)
                    </p>
                `;
            });
    
            content += `</div>`;
    
            // Remove any existing popup and add the new one
            if (currentPopup) currentPopup.remove();
    
            currentPopup = new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(content)
                .addTo(map);
        }
    });    

    map.on('load', function () {
        map.moveLayer('road-label-navigation');
        map.moveLayer('settlement-subdivision-label');
    });
});

