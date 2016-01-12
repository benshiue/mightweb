$(document).ready(function() {
  toggleBoxes();
});

var toggleBoxes = function() {
  // follow button handler
  $("input[data-tag='subscription']").each(function() {
      var me = $(this)
        , myId = me.attr('id')
        , _id = me.data('id')   // subscription id
        , label = $('label[for=' + myId + ']')
        , textSpan = $('span[data-id=' + _id + ']')
        , subject = ''
        , msgSubscribe = '正在關注中'
        , msgUnsubscribe = '我要關注此課程'
        , isSubscriber = true;

      // get subject
      $.ajax({
          type: "GET",
          url: '/1/subscription/' + _id,
          success: function( response ) {
            if (response.success !== true) return;
            subject = response.data.subject;

            // get isSubscriber
            $.ajax({
                type: "GET",
                url: '/1/subscription/' + _id + '/subscribers',
                success: function( response ) {
                  if (response.success !== true) return;

                  isSubscriber = response.isSubscriber;

                  if (isSubscriber === true) {
                    textSpan.html(subject + msgSubscribe);

                    me.checkbox('toggle');  // Flat UI API (see: flatui-checkbox.js)
                  } else {
                    textSpan.html(subject + msgUnsubscribe);
                  }
                },
                complete: function (response) {
                  me.on('change', function() {
                    var change = function() {
                      var checked = me.prop('checked');

                      if (checked === true) {
                          $.ajax({
                              type: "PUT",
                              url: '/1/subscription/' + _id + '/subscribe',
                              success: function( response ) {
                                if (!response.success) return;
                                textSpan.html(subject + msgSubscribe);
                                $.notify('已儲存變更: ' + subject + msgSubscribe, { position: 'bottom right', className: 'success' });
                              }
                          });
                      } else if (checked === false) {
                          $.ajax({
                              type: "PUT",
                              url: '/1/subscription/' + _id + '/unsubscribe',
                              success: function( response ) {
                                if (!response.success) return;
                                textSpan.html(subject + msgUnsubscribe);
                                $.notify('已儲存變更: ' + subject + msgUnsubscribe, { position: 'bottom right', className: 'error'  });
                              }
                          });
                      }
                    };

                    change();
                  });
                }
            });
          },
          complete: function (response) {
          }
      });
  });
};
