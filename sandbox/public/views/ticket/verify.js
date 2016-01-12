/**
 * SETUP
 **/
  var app = app || {};



/**
 * MODELS
 **/
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
      //console.log('PassID: ' + passId);

      this.model.save(this.model.attributes, {
        success: function(model, response, options) {
          if (response.success === false) {
            $.notify("有點問題...", { position: 'bottom right', className: 'error' });
          }
          //console.log(JSON.stringify(response));
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
    app.phoneVerifyView = new app.PhoneVerifyView();
  });
