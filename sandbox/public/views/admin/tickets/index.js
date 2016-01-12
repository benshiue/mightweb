/**
 * SETUP
 **/
  var app = app || {};



/**
 * MODELS
 **/
  app.Ticket = Backbone.Model.extend({
    url: function() {
      return '/1/ticket/user/default';
    },
    defaults: {
      success: false,
      errors: [],
      errfor: {},

      tickets: []
    }
  });

  app.PhoneVerify = Backbone.Model.extend({
    id: undefined,
    url: function() {
      return '/1/ticket/' + this.id + '/verify';
    },
    defaults: {
      success: false,
      errors: [],
      errfor: {},

      code: ''
    }
  });

/**
 * VIEWS
 **/
  app.TicketView = Backbone.View.extend({
    el: '#tickets',
    template: _.template( $('#tmpl-tickets').html() ),
    events: {
      'click .filter': 'mixItUp'
    },
    mixItUp: function(e) {
      var me = $(e.target);
      var filter = me.data('filter');

      this.$el.find('tbody tr').each(function(el) {
        $(this).addClass('hide');
      });

      this.$el.find(filter).each(function(el) {
        $(this).fadeIn('slow');
        $(this).removeClass('hide');
      });
    },
    initialize: function() {
      this.model = new app.Ticket();

      this.model.bind('change', this.render, this);
      this.syncUp();
    },
    syncUp: function() {
      this.model.fetch({
        success: function(model, response, options) {
        }
      });
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));

      /* MixItUp: jquery.mixitup.min.js */
      /* FIX: broken when using table */
      //$('#user-following').mixItUp();

      app.phoneVerifyView = new app.PhoneVerifyView();
    }
  });


  app.PhoneVerifyView = Backbone.View.extend({
    events: {
        'click .btn-verify': 'check'
    },
    initialize: function() {
      this.model = new app.PhoneVerify();
      this.toggle();
    },
    toggle: function() {
      var self = this;

      $('[data-tag=verify]').each(function() {
        var me = $(this);

        me.on('click', function() {
          var id = me.data('ticket-id');
          var obj = $('[name=' + id + ']');
          var code = obj.val();

          $.notify("正在驗證中，請候後...", { position: 'bottom right', className: 'success' });

          self.model.set('id', id); 
          self.model.set('code', code);

          self.model.save(self.model.attributes, {
            success: function(model, response, options) {
              if (response.success === false) {
                $.notify("票券不正常。建議重新報名。", { position: 'bottom right', className: 'error' });
                return app.ticketView.syncUp();
              }

              if (response.data.isVerified === false) {
                $.notify("票券驗證失敗。本票券已作廢。", { position: 'bottom right', className: 'error' });
                return app.ticketView.syncUp();
              }

              $.notify("恭喜！票券驗證成功。", { position: 'bottom right', className: 'success' });
              return app.ticketView.syncUp();
            },
            error: function(model, response, options) {
              $.notify("伺服器錯誤，請通知管理員", { position: 'bottom right', className: 'error' });
            }
          });
        });
      });
    }
  });

/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.ticketView = new app.TicketView();
  });
