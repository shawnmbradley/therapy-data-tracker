$(document)
    .ready(function() {
        console.log('ready');
        $('.pointing.menu .item').tab();

        $('.ui.dropdown')
        .dropdown()
        ;        
       
        $(".select-student").change( function() {
            var $this = $(this)
            var $id = $this.dropdown('get value')
            $(".generate-report").prop("href",
                "/student_reports/generate_manual_data_sheet/" + $id
            ).removeClass('disabled')
        })

        $(".print-this").click( function() {
            $(".print-section").printThis({

            });
        })

    })