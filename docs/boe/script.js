$(document).ready(function () {
    // Initialize Pym.js first
    var pymChild = new pym.Child();

    // Load the CSV file
    Papa.parse('candidates.csv', {
        download: true,
        header: true,
        complete: function (results) {
            // Populate the table with the data
            results.data.forEach(function(row, index) {
                // Define the background color for the first four rows
                const bgColor = index < 4 ? 'rgba(138, 214, 206, 0.4)' : 'transparent';
                // Define the font weight for the candidate names only
                const fontWeight = index < 4 ? 'bold' : 'normal';

                $('#electionResults tbody').append(
                    `<tr>
                        <td style="background-color: ${bgColor}; text-align: center; font-weight: ${fontWeight};">${row.candidate}</td>
                        <td style="background-color: ${bgColor}; text-align: center;">${row.total_votes}</td>
                        <td style="background-color: ${bgColor}; text-align: center;">${row.percentage}</td>
                    </tr>`
                );
            });

            // Initialize DataTables
            $('#electionResults').DataTable({
                "paging": false,
                "searching": false,
                "info": false,
                "ordering": false
            });

            // Collapse the second half of the table
            const totalRows = results.data.length;
            const halfRows = Math.floor(totalRows / 2);
            $('#electionResults tbody tr').slice(halfRows).hide(); // Hide the second half

            // Send the initial height to Pym.js
            pymChild.sendHeight();

            // Toggle visibility of the second half on button click
            $('#toggleTable').click(function () {
                $('#electionResults tbody tr').slice(halfRows).toggle(); // Toggle the visibility of the second half
                pymChild.sendHeight(); // Update Pym.js after toggling the table
            });

            // Resize Pym.js on window resize
            $(window).on('resize', function () {
                pymChild.sendHeight();
            });
        }
    });
});
