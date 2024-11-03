document.addEventListener('DOMContentLoaded', function () {
    // Initialize the Pym.js child
    var pymChild = new pym.Child();
    // Define access token
    mapboxgl.accessToken = "pk.eyJ1IjoibWxub3ciLCJhIjoiY2t0dnZwcm1mMmR5YzMycDNrcDZtemRybyJ9.Br-G0LTOB3M6w83Az4XGtQ";

    // Define basemap settings
    let mapZoom = window.innerWidth < 400 ? 10.4 : 11.1;
    let mapY = window.innerWidth < 400 ? 37.771 : 37.77;

    // Initialize the map
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mlnow/cm2tndow500co01pw3fho5d21',
        zoom: mapZoom,
        center: [-122.429, mapY],
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
                'fill-color': '#CECECE',
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

        document.getElementById('propositionDropdown').addEventListener('change', (event) => {
            const selectedProp = event.target.value; // Now, 'selectedProp' will be '1', '3', etc.
            const dataUrl = `data/${selectedProp}.geojson`;
        
            if (currentPopup) {
                currentPopup.remove();
                currentPopup = null;
            }
        
            map.getSource('precincts').setData(dataUrl);
        });
        

        // Bring specific labels to the front
        map.moveLayer('road-label-navigation');
        map.moveLayer('settlement-subdivision-label');

        // Resize iframe when charts are drawn
        pymChild.sendHeight();
    });
});
