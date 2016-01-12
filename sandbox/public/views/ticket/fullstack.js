/**
 * SETUP
 **/
  var app = app || {};



/**
 * MODELS
 **/
  app.LeanTask = Backbone.Model.extend({
    url: function() {
      return '/1/field';
    },
    defaults: {
      success: false,
      errors: [],
      errfor: {},

      code: '',
      field: '',
      value: '',
      passId: ''
    }
  });


/**
 * VIEWS
 **/
  app.LeanTaskView = Backbone.View.extend({
    el: '#fields',
    template: _.template( $('#tmpl-fields').html() ),
    events: {
        'submit form': 'preventSubmit',
        'click .btn-save': 'save'
    },
    initialize: function() {
      this.model = new app.LeanTask();
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));
    },
    preventSubmit: function(event) {
      event.preventDefault();
    },
    save: function() {
      var self = this;
      var passId;

      $.notify("儲存中...", { position: 'bottom right', className: 'success' });

      var complete = function() {
        $.ajax({
          url: '/1/field/' + passId + '/notify',
          type: 'POST',
          dataType: "json",
          success: function (data, textStatus, jqXHR) {
          },
          complete: function (data, textStatus, jqXHR) {
            $.notify('管理員已收到您的報名表！', { position: 'bottom right', className: 'info' });
          }
        });
      };

      $(".form-control").each(function() {
        var me = $(this);
        var code = me.data('code');
        var field = me.attr('name');
        var value = me.val();
        
        passId = me.data('pass-id');

        self.model.set('code', code);
        self.model.set('field', field);
        self.model.set('value', value);
        self.model.set('passId', passId);

        // The data model is alwasy POST (save). No update.
        self.model.save(self.model.attributes, {
          success: function(model, response, options) {
              if (response.success === false) {
                $.notify("有點問題...", { position: 'bottom right', className: 'error' });
              }
          },
          error: function(model, response, options) {
                $.notify("伺服器忙碌中...", { position: 'bottom right', className: 'error' });
          }
        });
      });

      complete();
    }
  });

/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.leanTaskView = new app.LeanTaskView();
  });
