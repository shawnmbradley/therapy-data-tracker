
$(".button.add-goal").click( function() {
    $('.ui.modal.add-goal')
    .modal({
        blurring: true
    })
    .modal('show')
    ;
    $('.add-goal-cancel').click( function() {
        $('.ui.modal.add-goal').modal('hide')
    })
    $('.add-goal-save').click( function(e) {
        e.preventDefault();
        document.addgoal.submit( function(e) {
            e.preventDefault();
            var $this = $(this);
            $.ajax({
                type: "POST",
                url: $this.attr("acction"),
                data: $this.searialize(),
                success: function(response) {
                    //alert(response.message);
                    $('.ui.modal.add-goal').modal('hide');
                }

            });
        });
    })

});

$(".select-student").change( function() {
    alert('asdf')
})

