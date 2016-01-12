/**
 * 用戶管理: 管理我的活動票券
 */

/**
 * SETUP
 **/
  var app = app || {};



/**
 * MODELS
 **/
  app.Tickets = Backbone.Model.extend({
    idAttribute: '_id',
    url: function() {
      return '/1/ticket/pass/' + this.id;
    },
    defaults: {
      success: false,
      errors: [],
      errfor: {},

      data: []
    }
  });

/**
 * VIEWS
 **/
  app.PassView = Backbone.View.extend({
    el: '#passes',
    template: _.template( $('#tmpl-pass-item').html() ),
    events: {
    },
    initialize: function() {
      this.model = new app.Tickets();

      this.listenTo(this.model, 'sync', this.render);
      this.listenTo(this.model, 'change', this.render);

      this.syncUp();
    },
    fetchData: function() {
      var id = app.passRoutes.getId();
      var self = this;

      if (id !== '') {
        $.ajax({
          url: '/1/ticket/pass/' + id,
          type: 'GET',
          dataType: "json",
          success: function (data, textStatus, jqXHR) {
            if (data.success !== true) return;
            self.model.set('data', data.data);
            alert('ok');
            alert(JSON.stringify(data.data));
          }
        });
      }
    },
    syncUp: function() {
      var id = app.passRoutes.getId();

      this.model.set('_id', id);
      
      this.model.fetch({
        success: function(model, response, options) {

        }
      });
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));

      this.toggle();
    },
    toggle: function() {
      var self = this;

      var setVerified = function(id) {
        $.notify('處理中...', { position: 'bottom right', className: 'info' });

        $.ajax({
          url: '/1/ticket/' + id + '/admin/set-verified',
          type: 'PUT',
          dataType: "json",
          success: function (data, textStatus, jqXHR) {
            if (data.success !== true) {
              $.notify('無法手動驗證此票券。', { position: 'bottom right', className: 'error' });
              return;
            }

            $.notify('已手動驗證此票券。', { position: 'bottom right', className: 'info' });
            self.syncUp();
          }
        });
      };

      var sendVerifyEmail = function(id) {
        $.notify('寄送中...', { position: 'bottom right', className: 'info' });

        $.ajax({
          url: '/1/ticket/' + id + '/admin/email-verify',
          type: 'PUT',
          dataType: "json",
          success: function (data, textStatus, jqXHR) {
            if (data.success !== true) {
              $.notify('無法寄送 Email。', { position: 'bottom right', className: 'error' });
              return;
            }

            $.notify('已成功寄出驗證 Email。', { position: 'bottom right', className: 'info' });
            self.syncUp();
          }
        });
      };

      this.$el.find('[data-tag=set-to-verified]').each(function() {
        var me = $(this);

        me.on('click', function() {
          var id = me.data('ticket-id');

          setVerified(id);
        });
      });

      this.$el.find('[data-tag=email-verify]').each(function() {
        var me = $(this);

        me.on('click', function() {
          var id = me.data('ticket-id');

          sendVerifyEmail(id);
        });
      });
    }
  });

/*
 * ROUTES
 */
app.PassRoutes = Backbone.Router.extend({
    routes: {
      ":id": "readByPassId"
      // http://www.mokoversity.com/tickets/list#5347f45e0c9a9e004000000f
    },

    id: '',

    readByPassId: function(passId) {
      id = passId;    
      app.passView = new app.PassView();
    },

    getId: function() {
      return id;
    }
});

/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.passRoutes = new app.PassRoutes();
    Backbone.history.start();
  });
