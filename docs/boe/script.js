$(document).ready(function() {
    // Load the CSV file
    Papa.parse('candidates.csv', {
        download: true,
        header: true,
        complete: function(results) {
            // Populate the table with the data
            results.data.forEach(function(row) {
                $('#electionResults tbody').append(
                    `<tr>
                        <td>${row.candidate}</td>
                        <td>${row.total_votes}</td>
                        <td>${row.percentage}</td>
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

            // Initialize Pym.js
            var pymChild = new pym.Child();

            // Resize Pym.js on window resize
            $(window).on('resize', function() {
                pymChild.sendHeight();
            });

            // Send the initial height to Pym.js
            pymChild.sendHeight();
        }
    });
});