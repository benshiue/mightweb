(function( $ ) {

   var toggleSubscription = function() {
        $("[data-subscription='submit']").each(function() {
            var me = $(this);
            me.on('click', function() {
                var id = me.data('id')
                    , target = "input[data-id='" + id + "']"
                    , email = $(target).val();

                me.text('儲存中...');

                $.ajax({
                    url: '/1/subscription/' + id + '/newsletter?email=' + email.trim(),
                    type: 'PUT',
                    complete: function (data, textStatus, jqXHR) {
                        me.text('儲存成功！');
                        me.addClass('disabled');

                        $(target).val(email + ': 已訂閱電子報');
                        alert('完成訂閱！')
                    },
                });
            });
        });
    };

    $(document).ready(function() {
        toggleSubscription();
    });

})( jQuery );

