document.addEventListener("DOMContentLoaded", function() {
    // create the iframe
    var pymChild = new pym.Child();

    // set variables
    var ballotDropdown = document.getElementById("ballot-dropdown");
    var calculator = document.getElementById("calculatorBox");
    var totalCostDisplay = document.getElementById("calculatorBox"); 
    var steps = ["step-2", "step-3", "step-4", "step-5", "step-6", "step-7", "step-8", "step-9"];
    steps.forEach(step => document.getElementById(step).style.display = "none");
    calculator.style.display = "none";
    var calculatorStartTop = 0;
    var bannerHeight = 141;

 

    // define costs
    var costs = [{'contest_type':'mayor','contest':'mayor','value':'LondonBreed','cost': 58.86},
    {'contest_type':'mayor','contest':'mayor','value':'MarkFarrell','cost': 85.03},
    {'contest_type':'mayor','contest':'mayor','value':'HenryFlynn', 'cost': 0},
    {'contest_type':'mayor','contest':'mayor','value':'DylanHirschShell', 'cost': 49.8},
    {'contest_type':'mayor','contest':'mayor','value':'DanielLurie', 'cost': 156.14},
    {'contest_type':'mayor','contest':'mayor','value':'NelsonMei', 'cost': 0},
    {'contest_type':'mayor','contest':'mayor','value':'AaronPeskin', 'cost': 34.27},
    {'contest_type':'mayor','contest':'mayor','value':'AhshaSafaí', 'cost': 96.17},
    {'contest_type':'mayor','contest':'mayor','value':'ShahramShariati', 'cost': 8},
    {'contest_type':'mayor','contest':'mayor','value':'EllenLeeZhou', 'cost': 3.12},
    {'contest_type':'mayor','contest':'mayor','value':'KeithFreedman', 'cost': 3.54},
    {'contest_type':'mayor','contest':'mayor','value':'PaulYbarraRobertson', 'cost': 0},
    {'contest_type':'mayor','contest':'mayor','value':'JonSoderstrom', 'cost': 0},
    {'contest_type':'prop','contest':'propA','value':'propAYes', 'cost': 1.39},
    {'contest_type':'prop','contest':'propA','value':'propANo', 'cost': 0},
    {'contest_type':'prop','contest':'propB','value':'propBYes','cost': 6.24},
    {'contest_type':'prop','contest':'propB','value':'propBNo','cost': 2.58},
    {'contest_type':'prop','contest':'propC','value':'propCYes','cost': 0.78},
    {'contest_type':'prop','contest':'propC','value':'propCNo','cost': 0.15},
    {'contest_type':'prop','contest':'propD','value':'propDYes','cost': 52.94},
    {'contest_type':'prop','contest':'propD','value':'propDNo','cost': 0.25},
    {'contest_type':'prop','contest':'propE','value':'propEYes','cost': 0.38},
    {'contest_type':'prop','contest':'propE','value':'propENo','cost': 35.24},
    {'contest_type':'prop','contest':'propF','value':'propFYes','cost': 1.75},
    {'contest_type':'prop','contest':'propF','value':'propFNo','cost': 0},
    {'contest_type':'prop','contest':'propG','value':'propGYes','cost': 0.74},
    {'contest_type':'prop','contest':'propG','value':'propGNo','cost': 0.1},
    {'contest_type':'prop','contest':'propH','value':'propHYes','cost': 11.55},
    {'contest_type':'prop','contest':'propH','value':'propHNo','cost': 0},
    {'contest_type':'prop','contest':'propI','value':'propIYes','cost': 2.98},
    {'contest_type':'prop','contest':'propI','value':'propINo','cost': 0.01},
    {'contest_type':'prop','contest':'propJ','value':'propJYes','cost': 0.06},
    {'contest_type':'prop','contest':'propJ','value':'propJNo','cost': 0},
    {'contest_type':'prop','contest':'propK','value':'propYes','cost': 3.13},
    {'contest_type':'prop','contest':'propK','value':'propKNo','cost': 1.63},
    {'contest_type':'prop','contest':'propL','value':'propLYes','cost': 1.85},
    {'contest_type':'prop','contest':'propL','value':'propLNo','cost': 3.53},
    {'contest_type':'prop','contest':'propM','value':'propMYes','cost': 8.25},
    {'contest_type':'prop','contest':'propM','value':'propMNo','cost': 0},
    {'contest_type':'prop','contest':'propN','value':'propNYes','cost': 0.96},
    {'contest_type':'prop','contest':'propN','value':'propNNo','cost': 0.01},
    {'contest_type':'prop','contest':'propO','value':'propOYes','cost': 1.12},
    {'contest_type':'prop','contest':'propO','value':'propONo','cost': 0},
    {'contest_type':'supe','contest':'D1','value':'JeremiahBoehner','cost': 2.7},
    {'contest_type':'supe','contest':'D1','value':'ConnieChan','cost': 95.38},
    {'contest_type':'supe','contest':'D1','value':'ShermanDSilva','cost': 0},
    {'contest_type':'supe','contest':'D1','value':'JenNossokoff','cost': 39.32},
    {'contest_type':'supe','contest':'D1','value':'MarjanPhilhour','cost': 56.4},
    {'contest_type':'supe','contest':'D3','value':'WendyHaChau','cost':21.73},
    {'contest_type':'supe','contest':'D3','value':'MoeJamil','cost': 112.88},
    {'contest_type':'supe','contest':'D3','value':'SharonLai','cost': 51.81},
    {'contest_type':'supe','contest':'D3','value':'EduardNavarro','cost': 70.24},
    {'contest_type':'supe','contest':'D3','value':'DannySauter','cost': 56.56},
    {'contest_type':'supe','contest':'D3','value':'MatthewSusk','cost': 63.88},
    {'contest_type':'supe','contest':'D5','value':'ScottyJacobs','cost': 74.74},
    {'contest_type':'supe','contest':'D5','value':'AllenJones','cost': 0},
    {'contest_type':'supe','contest':'D5','value':'AutumnHopeLooijen','cost': 30.33},
    {'contest_type':'supe','contest':'D5','value':'BilalMahmood','cost': 67.4},
    {'contest_type':'supe','contest':'D5','value':'DeanPreston','cost': 65.74},
    {'contest_type':'supe','contest':'D7','value':'MattBoschetto','cost': 30.24},
    {'contest_type':'supe','contest':'D7','value':'StephenMartinPinto','cost': 25.69},
    {'contest_type':'supe','contest':'D7','value':'MyrnaMelgar','cost': 25.96},
    {'contest_type':'supe','contest':'D7','value':'EdwardSYee','cost': 0},
    {'contest_type':'supe','contest':'D9','value':'JulianEBermudez','cost': 1.58},
    {'contest_type':'supe','contest':'D9','value':'HBrown','cost': 0},
    {'contest_type':'supe','contest':'D9','value':'TrevorChandler','cost': 49.6},
    {'contest_type':'supe','contest':'D9','value':'JackieFielder','cost': 34.03},
    {'contest_type':'supe','contest':'D9','value':'JaimeGutierrez','cost': 13.42},
    {'contest_type':'supe','contest':'D9','value':'RobertoHernandez','cost': 49.89},
    {'contest_type':'supe','contest':'D9','value':'StephenJonTorres','cost': 94.57},
    {'contest_type':'supe','contest':'D11','value':'ChyanneChen','cost': 114.66},
    {'contest_type':'supe','contest':'D11','value':'AdlahChisti','cost': 62.19},
    {'contest_type':'supe','contest':'D11','value':'OscarFlores','cost': 1.42},
    {'contest_type':'supe','contest':'D11','value':'ErnestEJJones','cost': 59.51},
    {'contest_type':'supe','contest':'D11','value':'MichaelLai','cost': 49.73},
    {'contest_type':'supe','contest':'D11','value':'RogerKMarenco','cost': 0},
    {'contest_type':'supe','contest':'D11','value':'JoseMorales','cost': 1.12},];


    // create the function for calculating the total cost
    function calculateTotalCost() {
        var totalCost = 0;
        var selectedRadios = document.querySelectorAll("input[type=radio]:checked");
        selectedRadios.forEach(radio => {
            var selectedValue = radio.value;
            var costItem = costs.find(item => item.value === selectedValue);
            if (costItem) {
                totalCost += costItem.cost;
            }
        });
        totalCostDisplay.innerHTML = `Total: <span style="font-weight: bold;">$${totalCost.toFixed(2)}</span>`;

        pymChild.sendHeight();

    }

    // event listener for radio buttons
    var radioButtons = document.querySelectorAll("input[type=radio]");
    radioButtons.forEach(radio => {
        radio.addEventListener("change", calculateTotalCost);

        pymChild.sendHeight();
        
    });
    
    // handling district changes
    ballotDropdown.addEventListener("change", function() {
        var selectedDistrict = ballotDropdown.value;
        
        resetCalculator();

        pymChild.sendHeight();

        steps.forEach(step => document.getElementById(step).style.display = "none");
        calculator.style.display = "none";

        // district change logic here

        if (selectedDistrict === "D1") {
            calculator.style.display = "block";
            document.getElementById("step-2").style.display = "block";
            document.getElementById("step-3").style.display = "block";
            document.getElementById("step-9").style.display = "block";
        } else if (selectedDistrict === "D2") {
            calculator.style.display = "block";
            document.getElementById("step-2").style.display = "block";
            document.getElementById("step-9").style.display = "block";
        } else if (selectedDistrict === "D3") {
            calculator.style.display = "block";
            document.getElementById("step-2").style.display = "block";
            document.getElementById("step-4").style.display = "block";
            document.getElementById("step-9").style.display = "block";
        } else if (selectedDistrict === "D4") {
            calculator.style.display = "block";
            document.getElementById("step-2").style.display = "block";
            document.getElementById("step-9").style.display = "block";
        } else if (selectedDistrict === "D5") {
            calculator.style.display = "block";
            document.getElementById("step-2").style.display = "block";
            document.getElementById("step-5").style.display = "block";
            document.getElementById("step-9").style.display = "block";
        } else if (selectedDistrict === "D6") {
            calculator.style.display = "block";
            document.getElementById("step-2").style.display = "block";
            document.getElementById("step-9").style.display = "block";
        } else if (selectedDistrict === "D7") {
            calculator.style.display = "block";
            document.getElementById("step-2").style.display = "block";
            document.getElementById("step-6").style.display = "block";
            document.getElementById("step-9").style.display = "block";
        } else if (selectedDistrict === "D8") {
            calculator.style.display = "block";
            document.getElementById("step-2").style.display = "block";
            document.getElementById("step-9").style.display = "block";
        } else if (selectedDistrict === "D9") {
            calculator.style.display = "block";
            document.getElementById("step-2").style.display = "block";
            document.getElementById("step-7").style.display = "block";
            document.getElementById("step-9").style.display = "block";
        } else if (selectedDistrict === "D10") {
            calculator.style.display = "block";
            document.getElementById("step-2").style.display = "block";
            document.getElementById("step-9").style.display = "block";
        } else if (selectedDistrict === "D11") {
            calculator.style.display = "block";
            document.getElementById("step-2").style.display = "block";
            document.getElementById("step-8").style.display = "block";
            document.getElementById("step-9").style.display = "block";
        }

        if (calculator.style.position == "static") {
            calculatorStartTop = parseFloat(calculator.offsetTop);
        }

        pymChild.sendHeight();

    });


    // reset calculator when select a different district 
    function resetCalculator() {
        totalCostDisplay.innerHTML = 'Total: <span style="font-weight: bold;">$0</span>';
        var radioButtons = document.querySelectorAll("input[type=radio]");
        radioButtons.forEach(radio => radio.checked = false);

        pymChild.sendHeight();
    }


    window.addEventListener("resize", () => {
        pymChild.sendHeight();
    });

    pymChild.onMessage('viewport-iframe-position', onScroll);

    function onScroll(parentInfo) {
        const arr1 = parentInfo.split(' ').map(Number);
        const parentTop = arr1[2];
        if (parentTop + calculatorStartTop < bannerHeight) {
            calculator.style.position = "absolute";
            calculator.style.top = bannerHeight - parentTop + "px";
        } else {
            calculator.style.position = "static";
        }
    }

    pymChild.onMessage('data', onData);

    function onData(parentInfo) {
        bannerHeight = Number(parentInfo);
    }

});
