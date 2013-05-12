define(['jquery', 'eventBus', 'bootstrap', 'toastr'], function($, EventBus, Bootstrap, Toastr) {
    "use strict";

    var modal = $('#loginModal');
    var input = $('#inputUsername');
    var button = $('#btnLogin');

    modal.on('shown', function() {
        input.val('');
        if (input.has('error')) input.removeClass('error');
        input.focus();
    });
    modal.modal('show');

    input.on('keypress', function(event) {
        if (13 !== event.which) return;

        event.preventDefault();
        button.click();
    });

    button.on('click', function() {
        var val = input.val().trim();
        if (!val) return;

        EventBus.fireEvent('login', val);
        modal.modal('hide');
        $('#main').show();
        Toastr.info('Welcome to Mayrouge');
    });
});