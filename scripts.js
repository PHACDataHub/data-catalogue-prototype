//get the catalogue data from the JSON file
const data = fetch('data.json')
    .then(response => response.json())
    .then(data => {
        //console.log(data); // Your JSON data as an array

        // initializes the DataTables table
        const table = $('#catalogueTable').DataTable({
            data: data,
            columns: [
                { data: "Dataset" },
                { data: "Acronym" },
                { data: "Description" },
                { data: "Keywords" },
                { data: "Objectives", visible: false },
                { data: "Coverage", visible: false },
                { data: "Quality Checks", visible: false },
                { data: "Frequency", visible: false },
                { data: "Sources", visible: false },
                { data: "Open Status", visible: false },
                { data: "Programming Language", visible: false },
                { data: "Years Available", visible: false },
                { data: "Indigenous Data", visible: false },
                { data: "SGBA+ Data", visible: false },
                { data: "Access", visible: false },
                { data: "Accessible To", visible: false },
                { data: "Audience", visible: false },
                { data: "Category", visible: false },
                { data: "Last Updated", visible: false }
            ]
        });
        table.on('draw', function () {
            var body = $(table.table().body());

            body.unhighlight();

            if ( table.rows( { filter: 'applied' } ).data().length ) {
                body.highlight( table.search() );
            }
        });

        // toggle visibility logic
        document.querySelectorAll('a.toggle-vis').forEach((el) => {
            el.addEventListener('click', function (e) {
                e.preventDefault();

                let columnIdx = e.target.getAttribute('data-column');
                let column = table.column(columnIdx);

                // Toggle the visibility
                column.visible(!column.visible());
                updateToggleLinkStyles(); // Update styles after toggle

                // Additional Trigger for Search Highlighting
                table.search(table.search()).draw();
            });
        });

        function updateToggleLinkStyles() {
            $('.toggle-vis').each(function () {
                const columnIdx = $(this).data('column');
                const column = table.column(columnIdx);

                if (column.visible()) {
                    $(this).addClass('visible-column');
                } else {
                    $(this).removeClass('visible-column');
                }
            });

        }
    })
    .catch(error => console.error('Error fetching JSON:', error));


$(document).ready(function () {

});