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

  app.PhoneVerify = Backbone.Model.extend({
    idAttribute: '_id',
    url: function() {
      return '/1/pass/' + this.attributes.passId + '/ticket';
    },
    defaults: {
      success: false,
      errors: [],
      errfor: {},

      phone: '',
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

      $.notify("儲存中...", { position: 'bottom right', className: 'success' });

      var complete = function() {
      	$('.verify').removeClass('hide');
      };

      $(".form-control").each(function() {
        var me = $(this);
        var code = me.data('code');
        var field = me.attr('name');
        var value = me.val();
        var passId = me.data('pass-id');

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

  app.PhoneVerifyView = Backbone.View.extend({
    el: '#verify',
    template: _.template( $('#tmpl-verify').html() ),
    events: {
        'submit form': 'preventSubmit',
        'click .btn-save': 'save'
    },
    initialize: function() {
      this.model = new app.PhoneVerify();
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
      var me = $(".form-control[name='phone']");
      var phone = me.val();
      var passId = me.data('pass-id');

      $.notify("傳送驗證碼至: " + phone, { position: 'bottom right', className: 'success' });
      
      this.model.set('phone', phone);
      this.model.set('passId', passId);
      console.log('PassID: ' + passId);

      this.model.save(this.model.attributes, {
        success: function(model, response, options) {
            if (response.success === false) {
              $.notify("有點問題...", { position: 'bottom right', className: 'error' });
            }
            console.log(JSON.stringify(response));
        },
        error: function(model, response, options) {
              $.notify("伺服器忙碌中...", { position: 'bottom right', className: 'error' });
        }
      });
    }
  });

/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.leanTaskView = new app.LeanTaskView();
    app.phoneVerifyView = new app.PhoneVerifyView();
  });
