//get the catalogue data from the JSON file
const data = fetch('data.json')
    .then(response => response.json())
    .then(data => {
        //console.log(data); // Your JSON data as an array

        // initializes the DataTables table
        const table = $('#catalogueTable').DataTable({
            data: data,
            scrollX: true,
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
                { data: "Last Updated", visible: false },
                { data: "Hyperlinks", visible: false }
            ]
        });

        // Make table cells focusable AFTER DataTables initialization
        $('#catalogueTable tbody td').attr('tabindex', 0);

        table.on('draw', function () {
            var body = $(table.table().body());

            body.unhighlight();

            if (table.rows({ filter: 'applied' }).data().length) {
                body.highlight(table.search());
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

                // Update data-column attributes after toggle
                updateDataColumnAttributes();

                updateToggleLinkStyles(); // Update styles after toggle

                // Additional Trigger for Search Highlighting
                table.search(table.search()).draw();

                // Make table cells focusable AFTER DataTables initialization
                $('#catalogueTable tbody td').attr('tabindex', 0);
            });
        });

        // Function to update data-column attributes
        function updateDataColumnAttributes() {
            $('.toggle-vis').each(function (index) {
                $(this).attr('data-column', index);
            });
        }

        function updateToggleLinkStyles() {
            $('.toggle-vis').each(function () {
                const columnIdx = $(this).data('column');

                // Check if columnIdx is valid
                if (typeof columnIdx !== 'undefined' && columnIdx >= 0 && columnIdx < table.columns().count()) {
                    const column = table.column(columnIdx);

                    if (column.visible()) {
                        $(this).addClass('visible-column');
                    } else {
                        $(this).removeClass('visible-column');
                    }
                } else {
                    console.error('Invalid column index:', columnIdx);
                }
            });
        }
    })
    .catch(error => console.error('Error fetching JSON:', error));
