// Path to your CSV file
const csvFilePath = 'candidates.csv';

Papa.parse(csvFilePath, {
    download: true, // Automatically download the CSV file
    header: true, // Use the first row as headers
    dynamicTyping: true, // Automatically convert numbers and booleans
    complete: function(results) {
        console.log(results.data); // Log the parsed data to check structure

        $('#electionResults').DataTable({
            data: results.data,
            columns: [
                { data: 'candidate' },
                { data: 'total_votes' },
                { data: 'percentage' }
            ],
            paging: true,
            searching: true
        });
    },
    error: function(error) {
        console.error('Error loading CSV:', error);
    }
});


// $(document).ready(function () {
//     // Load data from CSV file using PapaParse
//     Papa.parse("./data.csv", {
//         download: true,
//         header: true,
//         complete: function (results) {
//             console.log("Parsed data:", results.data); // Log parsed data to inspect the structure

//             // Initialize Pym.js
//             var pymChild = new pym.Child();

//             // Resize Pym.js on window resize
//             $(window).on('resize', function () {
//                 pymChild.sendHeight();
//             });

//             // Send the initial height to Pym.js
//             pymChild.sendHeight();
//         }
//     });
// });
