$(document).ready(function () {
    // Initialize Pym.js first
    var pymChild = new pym.Child();
    
    pymChild.sendHeight();

    // Load the CSV file
    Papa.parse('candidates.csv', {
        download: true,
        header: true,
        complete: function (results) {
            // Populate the table with the data
            results.data.forEach(function(row) {
                // Determine the background color for the second column based on the "pass" column
                const recipientBgColor = row.pass === "true" 
                    ? 'rgba(13, 214, 199, 0.4)' // Blue for true
                    : 'rgba(233, 159, 106, 0.4)'; // Red for false

                // Add a row with donor photo, recipient, and amount
                $('#electionResults tbody').append(
                    `<tr>
                        <td style="text-align: center;">
                            <img src="${row.donorPhoto}" alt="${row.donor}" style="width: 75px; height: 75px; border-radius: 50%; object-fit: cover;">
                            <br><strong>${row.donor}</strong>
                        </td>
                        <td style="text-align: center; background-color: ${recipientBgColor};">${row.recipient}</td>
                    </tr>`
                );

            });

            pymChild.sendHeight();

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
