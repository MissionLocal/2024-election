$(document).ready(function () {
    // Initialize Pym.js first
    var pymChild = new pym.Child();
    
    // Load the CSV file
    Papa.parse('candidates.csv', {
        download: true,
        header: true,
        complete: function (results) {
            // Populate the table with the data
            results.data.forEach(function(row) {
                const recipientBgColor = row.pass === "true" 
                    ? 'rgba(13, 214, 199, 0.4)' 
                    : 'rgba(233, 159, 106, 0.4)';

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

            // Wait for all images to load before sending height
            $('#electionResults img').on('load', function () {
                pymChild.sendHeight();
            });

            // Initialize DataTables
            $('#electionResults').DataTable({
                "paging": false,
                "searching": false,
                "info": false,
                "ordering": false
            });

            // Send height after initialization
            pymChild.sendHeight();

            // Resize Pym.js on window resize
            $(window).on('resize', function () {
                pymChild.sendHeight();
            });
        }
    });
});
