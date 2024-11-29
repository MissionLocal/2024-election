// define mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoibWxub3ciLCJhIjoiY2t0dnZwcm1mMmR5YzMycDNrcDZtemRybyJ9.Br-G0LTOB3M6w83Az4XGtQ";

// define basemap
if (window.innerWidth < 400) {
    var mapZoom = 11;
    var mapY = 37.765;
} else {
    var mapZoom = 11;
    var mapY = 37.758;
}
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mlnow/cm38404cu007c01r883k16tl6',
    zoom: mapZoom,
    center: [-122.438, mapY],
});

// define stuff
var mapFill = 'map_fill_001'
var source = 'basemap'
var selectedAreas = []
var legendDetailsLocal = document.getElementById("legend-details-local")
var legendDetailsTotal = document.getElementById("legend-details-total")
var results = document.getElementById('results')
var areaList = document.getElementById('area-list')
var dropdown = document.getElementById('dataset-dropdown');
var pymChild = new pym.Child();
const fullnames = {
    'mayor': ['Mayor', 'First choice votes'],
    'district1': ['District 1 supervisor', 'First choice votes'],
    'district3': ['District 3 supervisor', 'First choice votes'],
    'district5': ['District 5 supervisor', 'First choice votes'],
    'district7': ['District 7 supervisor', 'First choice votes'],
    'district9': ['District 9 supervisor', 'First choice votes'],
    'district11': ['District 11 supervisor', 'First choice votes'],
    'president': ['President', ''],
    'boe': ['Board of Education', ''],
    'cc': ['City College Board', ''],
    'da': ['District Attorney', ''],
    'cityattorney': ['City Attorney', ''],
    'treasurer': ['Treasurer', ''],
    'sheriff': ['Sheriff', ''],
    'bartboard7': ['BART Board District 7', ''],
    'bartboard9': ['BART Board District 9', ''],
    'statead17': ['State Assembly District 17', ''],
    'statead19': ['State Assembly District 19', ''],
    'senator': ['Senator', ''],
    'senatorp': ['Senator (partial term)'],
    'rep11': ['Representative District 11', ''],
    'rep15': ['Representative District 15', ''],
    'sen11': ['State Senator District 11', ''],
    'propA': ['Proposition A', 'School bond'],
    'propB': ['Proposition B', 'Health and medical facilities bond'],
    'propC': ['Proposition C', 'Inspector General'],
    'propD': ['Proposition D', 'Commission reform'],
    'propE': ['Proposition E', 'Commission reform'],
    'propF': ['Proposition F', 'Police retirement deferral'],
    'propG': ['Proposition G', 'Rental subsidies'],
    'propH': ['Proposition H', 'Firefighter early retirement'],
    'propI': ['Proposition I', 'Retirement benefits'],
    'propJ': ['Proposition J', 'Oversight for funding youth programs'],
    'propK': ['Proposition K', 'Closing the Great Highway'],
    'propL': ['Proposition L', 'Ride-hailing vehicle tax'],
    'propM': ['Proposition M', 'Business tax reform'],
    'propN': ['Proposition N', 'First responder student loan fund'],
    'propO': ['Proposition O', 'Supporting reproductive freedom'],
    'turnout': ['Turnout', '']
}

///
/// PRIMARY FUNCTIONS
///

// main function
async function main() {
    const datasets = await fetchData(Object.keys(fullnames));
    const lookup = await fetchCSV('lookup');
    const total_voters = Object.values(datasets['turnout']['votes_cast']).reduce((acc, value) => acc + value, 0);

    // set total voters
    legendDetailsTotal.innerHTML = numberWithCommas(total_voters);

    // when something on the map is clicked, trigger interaction code
    map.on('click', mapFill, (e) => {
        hoveredId = e.features[0].properties.precinct;
        onMapClick(datasets, fullnames, hoveredId);
    });

    // when something on the dropdown is clicked, trigger interaction code
    dropdown.addEventListener('change', function () {
        onDropdownSelect(datasets, fullnames, lookup, this.value);
    });
}

// when map is clicked
function onMapClick(datasets, fullnames, hoveredId) {

    if (selectedAreas.includes(hoveredId)) {
        removeItem(selectedAreas, hoveredId)
        changeMapSelection([hoveredId], false);
    } else {
        selectedAreas.push(hoveredId)
        changeMapSelection([hoveredId], true);
    }

    generate(datasets, fullnames, selectedAreas);
}

// when dropdown is clicked
function onDropdownSelect(datasets, fullnames, lookup, value) {

    selectedAreas = lookup.filter(function (el) {
        return el.district == value;
    }).map(function (el) {
        return el.precinct;
    });
    var allAreas = lookup.map(function (el) {
        return el.precinct;
    }).slice(1);

    changeMapSelection(allAreas, false);
    if (value == 'custom') {
        clear();
    } else {
        changeMapSelection(selectedAreas, true);
    }

    generate(datasets, fullnames, selectedAreas);
}

// function to change map selection
function changeMapSelection(areas, bool) {
    areas.forEach(function (area) {
        if (area == undefined) {
            return
        }
        map.setFeatureState(
            { source: source, id: area },
            { selected: bool }
        );
    });
}


function generate(datasets, fullnames, selectedAreas) {
    results.innerHTML = ""; // clear the results
    propositions.innerHTML = ""; // clear the propositions

    if (selectedAreas.length == 0) {
        areaList.innerHTML = "<span class='area'>No area selected</span>";
        results.innerHTML = "";
        legendDetailsLocal.innerHTML = "0";
        dropdown.value = 'custom';
        return;
    }

    let areaListHTML = "";
    areaList.innerHTML = areaListHTML + "<button id='clear-button'>Clear selection</button>";

    local_voters = selectedAreas.reduce((acc, area) => acc + datasets['turnout']['votes_cast'][area], 0);
    legendDetailsLocal.innerHTML = numberWithCommas(local_voters);

    var clearButton = document.getElementById("clear-button");
    clearButton.addEventListener("click", clear);

    let keys = Object.keys(datasets);
    for (let i = 0; i < keys.length - 1; i++) {
        let key = keys[i];
        let dataset = datasets[key];
        let columns = Object.keys(dataset);

        let columnCitySums = columns.map(column => Object.values(dataset[column]).reduce((acc, value) => acc + value, 0));
        let localColumnSums = columns.map(column =>
            selectedAreas.reduce((localAcc, area) => localAcc + dataset[column][area], 0)
        );

        const totalLocalSum = localColumnSums[localColumnSums.length - 1];
        localColumnSums = localColumnSums.slice(0, -1);
        columns = columns.slice(0, -1);
        const localRates = columns.map((_, j) => (localColumnSums[j] / totalLocalSum) * 100);

        const totalCitySum = columnCitySums[columnCitySums.length - 1];
        columnCitySums = columnCitySums.slice(0, -1);
        const cityRates = columns.map((_, j) => (columnCitySums[j] / totalCitySum) * 100);
        if (localColumnSums[0] > 0) {
            let headerTag = "h4";  // Default header tag
            let HTML = "";
        
            // Check if the key is a "Proposition" and use h6 for Propositions
            if (fullnames[key] && fullnames[key][0].includes("Proposition")) {
                headerTag = "h6";  // Change to h6 for Propositions
            }
        
            HTML = "<" + headerTag + " class='chart-heading' id='heading-" + key + "' style='cursor: pointer;'>" + (fullnames[key] ? fullnames[key][0] : "Unknown") + "</" + headerTag + ">" +
                '<div class="chart" id="chart-' + key + '" style="display: none;">' +  // Hide the chart initially
                '<p><em>' + (fullnames[key] ? fullnames[key][1] : "No description available") + '</em></p>';
        
            for (let i = 0; i < columns.length; i++) {
                HTML +=
                    '<div class="glass">' +
                    `<p class="bar-label" id="label-${removeSpaces(key + columns[i])}"></p>` +
                    `<div class="progress-container">` +
                    `<div class="progress-citywide" id="progress-citywide-${removeSpaces(key + columns[i])}"></div>` +
                    `<div class="progress-local" id="progress-local-${removeSpaces(key + columns[i])}"></div>` +
                    // Add the percentage span here
                    `<span class="progress-percentage" id="percentage-${removeSpaces(key + columns[i])}"></span>` +
                    `</div>` +
                    `<div class="mark-text" id="mark-text-${removeSpaces(key + columns[i])}"></div>` +
                    '</div>';
            }
            HTML += '</div><hr>';
        
            // Check if the "propositions" or "results" div exists
            let targetDiv = document.getElementById('results');  // Default target
            if (fullnames[key] && fullnames[key][0].includes("Proposition")) {
                targetDiv = document.getElementById('propositions');  // Use the "propositions" div if "Proposition" is found
            }
        
            if (fullnames[key] && fullnames[key][0].includes("Proposition")) {
                document.getElementById("propositions-heading").style.display = "block";
            }
        
            // Ensure the target div exists before appending content
            if (targetDiv) {
                targetDiv.innerHTML += HTML;
            } else {
                console.error('Target div not found');
            }
        
            // Update the progress bars and percentages
            for (let i = 0; i < columns.length; i++) {
                let localRateElement = document.getElementById("progress-local-" + removeSpaces(key + columns[i]));
                let markTextElement = document.getElementById("mark-text-" + removeSpaces(key + columns[i]));
                let cityRateElement = document.getElementById("progress-citywide-" + removeSpaces(key + columns[i]));
                let labelElement = document.getElementById("label-" + removeSpaces(key + columns[i]));
                let percentageElement = document.getElementById("percentage-" + removeSpaces(key + columns[i]));  // Get percentage element
        
                if (localRateElement && markTextElement && cityRateElement && labelElement && percentageElement) {
                    // Set widths for progress bars
                    localRateElement.style.width = String(localRates[i]) + "%";
                    // Position the mark-text at the end of the progress-local bar
                    markTextElement.style.left = `calc(${localRates[i]}% + 2px)`;  // Adjust +2px to fine-tune the positioning
                    markTextElement.innerHTML = "<span class='bar-highlight local-highlight'>" + String(round(localRates[i]), 0) + "%</span>";
        
                    cityRateElement.style.width = String(cityRates[i]) + "%";
                    labelElement.innerHTML = "<strong>" + toTitleCase(columns[i]) + "</strong>" + " (<span class='overall-highlight'>" + String(round(cityRates[i]), 0) + "%</span>)";
                    
                    // Create and position the label for Citywide at the end of the bar
                    let citywideLabelElement = document.createElement("span");
                    citywideLabelElement.classList.add("citywide-label");
                    citywideLabelElement.innerHTML = `<strong>${String(round(cityRates[i]), 0)}%</strong>`;
        
                    // Append the label to the citywide bar (at the end)
                    cityRateElement.appendChild(citywideLabelElement);
        
                    // Calculate the percentage for each bar
                    let percentage = cityRates[i];  // This could be a different variable depending on your logic
                    percentageElement.textContent = `${percentage}%`;  // Set percentage text
        
                    // Adjust chart height if necessary
                    if (fullnames[key][1] == '') {
                        document.getElementById("chart-" + key).style.height = String((80 * columns.length) - 10) + "px";
                    } else {
                        document.getElementById("chart-" + key).style.height = String((80 * columns.length) + 20) + "px";
                    }
                } else {
                    console.error("Some elements are missing in the DOM for chart: " + key);
                }
            }
        }
        
        
    }
    // Add event listeners for expanding/collapsing charts
    addExpandCollapseListeners();
}

function addExpandCollapseListeners() {
    // Get all chart headings (h4 or h6 elements)
    const headings = document.querySelectorAll('.chart-heading');

    // Add click event listener to each heading
    headings.forEach(heading => {
        // Initialize the indicator if not already present
        if (!heading.querySelector('.expand-collapse-indicator')) {
            const indicator = document.createElement('span');
            indicator.classList.add('expand-collapse-indicator');
            indicator.textContent = '+'; // Default indicator is '+'
            heading.appendChild(indicator); // Add indicator next to heading
        }

        heading.addEventListener('click', function () {
            const chartDiv = document.getElementById('chart-' + heading.id.replace('heading-', ''));
            const indicator = heading.querySelector('.expand-collapse-indicator');

            // Check the current display style of the chart div
            if (chartDiv.style.display === 'none' || chartDiv.style.display === '') {
                chartDiv.style.display = 'block'; // Show the chart
                indicator.textContent = '-'; // Change the indicator to '-'
            } else {
                chartDiv.style.display = 'none'; // Hide the chart
                indicator.textContent = '+'; // Change the indicator to '+'
            }
        });
    });
}


// function to clear everything
function clear() {
    // clear the map
    selectedAreas.forEach(function (area) {
        changeMapSelection([area], false)
    });
    selectedAreas = [];

    // clear the list of areas at the bottom of the map
    areaList.innerHTML = "<span class='area'>No area selected</span>"
    results.innerHTML = ""
    propositions.innerHTML = ""
    legendDetailsLocal.innerHTML = "0"

    document.getElementById("propositions-heading").style.display = "none";

    // select custom in dropdown
    dropdown.value = 'custom';

    // change pym height
    delay(250).then(() => pymChild.sendHeight());
};

///
/// MAPBOX FUNCTIONS
///

// function to define map fill information
function mapFillFunction(mapID, visibility, source) {
    mapFillDetails = {
        id: mapID,
        type: "fill",
        source: source,
        layout: {
            'visibility': visibility
        },
        paint: {
            "fill-color": [
                'case',
                ['boolean', ['feature-state', 'selected'], false],  // color when selected
                '#f220de',  // color when selected
                'transparent'  // no color when not selected (no default color)
            ],
            "fill-opacity": [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.85,
                0.65
            ],
        },
    }
    return mapFillDetails;
}

// function to define map outline information
function mapOutlineFunction(mapID, visibility, source) {
    mapOutlineDetails = {
        id: mapID,
        type: "line",
        source: source,
        layout: {
            "visibility": visibility
        },
        paint: {
            "line-color": "#f220de",
            "line-width": ['case', ['boolean', ['feature-state', 'hover'], false], 2, 0]
        },
    }
    return mapOutlineDetails;
}

///
/// SECONDARY FUNCTIONS
///

// function to remove spaces
function removeSpaces(inputString) {
    return inputString.replace(/\s/g, '');
}

// delay for a bit
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// function to round numbers
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

// function to return numbers with commas
function numberWithCommas(x) {
    if (isFinite(x)) {
        x = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return x;
    }
    else {
        return '0'
    }
}

// function to remove value from an array
function removeItem(arr, value) {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}

// function to make stuff title case
function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    ).replace(
        /-\w/g,
        function (txt) {
            return txt.charAt(0) + txt.charAt(1).toUpperCase() + txt.substr(2).toLowerCase();
        }
    );
}

///
/// LOAD MAP DATA
///

// load my map layers
map.on("load", function () {
    mapLayers = ['basemap']
    for (var i = 0; i < mapLayers.length; i++) {
        map.addSource(mapLayers[i], {
            'type': 'geojson',
            'data': 'data/' + mapLayers[i] + '.geojson?nocache=' + (new Date()).getTime(),
            'promoteId': 'precinct'
        });
    }
    mapFillFunction("map_fill_001", "visible", "basemap");
    map.addLayer(mapFillDetails, "water-point-label");
    mapOutlineFunction("map_outline_001", "visible", "basemap");
    map.addLayer(mapOutlineDetails, "water-point-label");
});

// function to fetch data
async function fetchData(files) {
    let datasets = {};
    for (let i = 0; i < files.length; i++) {
        var response = await fetch('data/' + files[i] + '.json?nocache=' + (new Date()).getTime());
        var data = await response.json();
        datasets[files[i]] = data;
    }
    return datasets
}

// function to fetch csv
async function fetchCSV(file) {
    var response = await fetch('data/' + file + '.csv?nocache=' + (new Date()).getTime());
    var lookup = await response.text();
    // turn text into object
    lookup = lookup.split('\n').map(row => row.split(','));
    lookup = lookup.map(row => {
        let obj = {}
        for (let i = 0; i < row.length; i++) {
            obj[lookup[0][i]] = row[i]
        }
        return obj
    });
    return lookup
}

// trigger hover effects when entering area
map.on('mouseenter', mapFill, function () { map.getCanvas().style.cursor = 'pointer'; });
map.on('mouseleave', mapFill, function () { map.getCanvas().style.cursor = ''; });
let hoveredId = null;
map.on('mousemove', mapFill, (e) => {
    if (e.features.length > 0) {
        if (hoveredId !== null) {
            map.setFeatureState(
                { source: source, id: hoveredId },
                { hover: false }
            );
        }
        hoveredId = e.features[0].properties.precinct;
        map.setFeatureState(
            { source: source, id: hoveredId },
            { hover: true }
        );
    }
});

// stop hover effects when leaving area
map.on('mouseleave', mapFill, () => {
    if (hoveredId !== null) {
        map.setFeatureState(
            { source: source, id: hoveredId },
            { hover: false }
        );
    }
    hoveredId = null;
});

// add navigation
map.addControl(new mapboxgl.NavigationControl());

// fit map to container
this.map.once('load', () => {
    this.map.resize();
});

//set everything off
main();