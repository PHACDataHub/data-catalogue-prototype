//get the catalogue data from the JSON file
const data = fetch('data/data.json')
    .then(response => response.json())
    .then(data => {
        //console.log(data); // Your JSON data as an array

        // initializes the DataTables table
        const table = $('#catalogueTable').DataTable({
            data: data,
            scrollX: true,
            scrollY: '50vh',  // You can adjust the height value as needed
            scroller: true,
            columns: [
                { data: "Dataset" },
                { data: "Acronym" },
                { data: "Description" },
                { data: "Keywords" },
                { data: "Objectives" },
                { data: "Coverage" },
                { data: "Quality Checks" },
                { data: "Frequency" },
                { data: "Sources" },
                { data: "Open Status" },
                { data: "Programming Language" },
                { data: "Years Available" },
                { data: "Indigenous Data" },
                { data: "SGBA+ Data" },
                { data: "Access" },
                { data: "Accessible To" },
                { data: "Audience" },
                { data: "Last Updated" },
                { data: "Hyperlinks" }
            ],

            // Add this line to change the search label
            language: {
                search: "Search Catalogue",
            }
        });

        // Hide the columns you want to hide initially
        table.columns([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]).visible(false);


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
        document.querySelector('.toggle-columns').addEventListener('click', function (event) {
            if (event.target.tagName === 'BUTTON') {
                event.preventDefault(); // Prevent any default button behavior

                let columnIdx = event.target.dataset.column;
                let column = table.column(columnIdx);

                // Toggle the visibility
                column.visible(!column.visible());

                // Update ARIA label based on visibility
                if (column.visible()) {
                    event.target.setAttribute('aria-label', `Remove ${event.target.textContent} column from table`);
                } else {
                    event.target.setAttribute('aria-label', `Add ${event.target.textContent} column to table`);
                }

                updateToggleLinkStyles(); // Update styles after toggle

                // Additional Trigger for Search Highlighting
                table.search(table.search()).draw();
            }
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

