document.addEventListener('DOMContentLoaded', function () {
    // Initialize the Pym.js child
    var pymChild = new pym.Child();

    // Load the CSV data
    d3.csv("data.csv").then(function (data) {
        console.log(data); // Check if data is loaded correctly

        if (data.length === 0) {
            console.error("No data loaded.");
            return; // Exit if no data
        }

        // Define the max domain value for a fixed scale across all bars
        const maxDomainValue = 100; // or choose a value based on your dataset

        // Initialize the x scale globally with a fixed width
        const width = 300; // Increased fixed width for each bar chart
        const xScale = d3.scaleLinear()
            .domain([0, maxDomainValue]) // Fixed domain for consistency
            .range([0, width]);

        // Convert the Value to a number for each entry
        data.forEach(d => {
            d.Value = +d.Value; // Ensure Value is treated as a number
        });

        // Set up a single SVG container for all bars
        const barHeight = 30; // Height of each bar
        const padding = 10; // Padding for the SVG
        const barPadding = 5; // Additional space between bars
        const svgHeight = (data.length * (barHeight + barPadding)) + padding; // Total height for the SVG

        const svg = d3.select('.bar-chart')
            .append("svg")
            .attr("width", width + 100) // Keep the extra space for labels and values
            .attr("height", svgHeight); // Use calculated height

        // Add labels and bars for each candidate
        data.forEach((d, index) => {
            // Calculate the vertical position for the middle of the bar
            const barY = index * (barHeight + barPadding) + 2; // Starting Y position for the bar
            const labelY = barY + 18; // Center of the bar

            // Add labels for candidates
            svg.append("text")
                .attr("x", 0)
                .attr("y", labelY) // Centered vertically in line with the rect
                .text(d.Candidate) // Set the text to the candidate name
                .attr("fill", "black")
                .attr("font-size", "14px")
                .attr("text-anchor", "start")
                .attr("class", "label");

            // Determine the color for the bar
            const barColor = d.Value > maxDomainValue / 2 ? "#8ad6ce" : "#f36e57"; // Adjust the condition as needed

            // Create bars with consistent widths and increased height
            svg.append("rect")
                .attr("x", 50) // Space for labels
                .attr("y", barY) // Use index for positioning
                .attr("width", xScale(d.Value)) // Using the d.Value directly
                .attr("height", barHeight - 4) // Adjusted height of the bars
                .attr("fill", barColor); // Set the fill color based on value

            // Display values on the right side of each bar
            svg.append("text")
                .attr("x", 50 + xScale(d.Value) + 5)
                .attr("y", labelY) // Centered vertically in line with the rect
                .text(d.Value + "%") // Display the value
                .attr("fill", "black")
                .attr("font-size", "14px")
                .attr("text-anchor", "start")
                .attr("class", "value");
        });

        // Resize the iframe once charts are drawn
        pymChild.sendHeight();

        // Debugging: Log SVG dimensions
        console.log("SVG Width:", width + 100);
        console.log("SVG Height:", svgHeight);
    }).catch(function (error) {
        console.error("Error loading the CSV data:", error);
    });
});
