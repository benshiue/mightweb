/**
 * SETUP
 **/
  var app = app || {};

/**
 * MODELS
 **/

/**
 * VIEWS
 **/
  app.ShortcutsView = Backbone.View.extend({
    el: '#shortcuts',
    events: {
    },
    initialize: function() {
      this.render();
    },
    render: function() {
      this.toggle();
    },
    toggle: function() {
      $("button[data-toggle='shortcuts']").each(function() {
          var me = $(this);

          me.on('click', function() {
            var action = me.data('action');

            if (action === 'dbox-lists') {
              var listId = me.data('list-id')

              $.notify('開始執行...', { position: 'bottom right', className: 'success' });

              $.ajax({
                url: '/1/subscription/' + listId + '/lists',
                type: 'GET',
                dataType: "json",
                success: function (data, textStatus, jqXHR) {
                },
                complete: function (data, textStatus, jqXHR) {
                  $.notify('已完成！', { position: 'bottom right', className: 'success' });
                }
              });
            } else if (action === '[other]') {

            } else {

            }
          });
      });
    }
  });

/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.ShortcutsView = new app.ShortcutsView();
  });
