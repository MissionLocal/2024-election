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
                const bgColor = index < 1 ? 'rgba(138, 214, 206, 0.4)' : 'transparent';
                // Define the font weight for the candidate names only
                const fontWeight = index < 1 ? 'bold' : 'normal';

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

            // Resize Pym.js on window resize
            $(window).on('resize', function () {
                pymChild.sendHeight();
            });
        }
    });
});
