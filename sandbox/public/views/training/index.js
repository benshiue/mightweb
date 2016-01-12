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
      passId: '',

      // 特別欄位: 紀錄手機號碼
      phone: ''
    }
  });

  app.PhoneVerify = Backbone.Model.extend({
    idAttribute: '_id',
    url: function() {
      return '/1/pass/' + this.attributes.passId + '/ticket/paypal';
    },
    defaults: {
      success: false,
      errors: [],
      errfor: {},

      phone: '',
      passId: ''
    }
  });

app.Gravatar = Backbone.Model.extend({
    // http://en.gravatar.com/400c529007e2242ac7132c78fc772e91.json
    url: function() {
        return 'http://www.gravatar.com/' + this.emailHash + '.json';
    },
    emailHash: '',
    defaults: {
        errors: [],
        errfor: {},

        entry: []
    },
});

/**
 * VIEWS
 **/
  app.LeanTaskView = Backbone.View.extend({
    el: '#main',
    template: _.template( $('#tmpl-fields').html() ),
    events: {
        'submit form': 'preventSubmit',
        'click .btn-save': 'save'
    },
    initialize: function() {
      this.model = new app.LeanTask();
      this.verify = new app.PhoneVerify();

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
      var errfor = {};

      $.notify("儲存中...", { position: 'bottom right', className: 'success' });

      // var complete = function() {
      //   $.ajax({
      //     url: '/1/field/' + passId + '/notify',
      //     type: 'POST',
      //     dataType: "json",
      //     success: function (data, textStatus, jqXHR) {
      //     },
      //     complete: function (data, textStatus, jqXHR) {
      //       $.notify('管理員已收到您的報名表！', { position: 'bottom right', className: 'info' });
      //     }
      //   });
      // };

      var complete = function() {
        $.notify('管理員已收到您的報名表！', { position: 'bottom right', className: 'info' });
      
        
      };

      // Pass 1: check for must fields
      $(".form-control").each(function() {
        var me = $(this);
        var field = me.attr('name');
        var value = me.val();
        var must = me.data('must')
      
        // is this a must fill field ?
        if (must === true && value === '') {
          errfor = self.model.get('errfor');
          errfor[field] = 'must';
        }
      });

      errfor = self.model.get('errfor');
      // use underscore to check if the obj is empty
      // see: http://stackoverflow.com/questions/4994201/is-object-empty
      if (!_.isEmpty(errfor)) {
        self.model.set('errors', ['必填欄位']);
        return self.render();
      }

      // Pass 2: saving each fields
      $(".form-control").each(function() {
        var me = $(this);
        var code = me.data('code');
        var field = me.attr('name');
        var value = me.val();
        var must = me.data('must');

        passId = me.data('pass-id');

        self.model.set('code', code);
        self.model.set('field', field);
        self.model.set('value', value);
        self.model.set('passId', passId);

        if (field === 'mobile') {
          self.verify.set('phone', value);
          self.verify.set('passId', passId);
        }

        // The data model is alwasy POST (save). No update.
        self.model.save(self.model.attributes, {
          success: function(model, response, options) {
              if (response.success === false)
                return $.notify("有點問題...", { position: 'bottom right', className: 'error' });
              //$.notify("ok", { position: 'bottom right', className: 'success' });
          },
          error: function(model, response, options) {
              $.notify("伺服器忙碌中...", { position: 'bottom right', className: 'error' });
          }
        });
      });

      complete();
    }
  });

app.GravatarView = Backbone.View.extend({
    el: '#gravatar',
    events: {
    },
    initialize: function() {
        this.model = new app.Gravatar();
        this.template = _.template($('#tmpl-gravatar').html());

        //this.listenTo(this.model, 'sync', this.render);
        //this.listenTo(this.model, 'change', this.render);

        this.syncUp();
    },
    syncUp: function() {
        var emailHash;
        var self;

        emailHash = this.$el.data('email-hash');
        this.model.emailHash = emailHash;

        self = this;

        this.model.fetch({
            // backbone supports CORS
            // see: http://stackoverflow.com/questions/16041172/backbone-js-wont-make-cross-host-requests
            dataType: 'jsonp',
            success: function(model, response, options) {
                self.render();
            },
            error: function(model, response, options) {

            }
        });
    },
    render: function() {
        this.$el.html(this.template( this.model.toJSON() ));

        $('#use-gravatar').removeClass('hide');
        $('#use-local').addClass('hide');
    }
});

/**
 * BOOTUP
 **/
  $(document).ready(function() {
    // data tags
    var togglePassTickets = function() {
      var me = $('.btn-ticket');
      
      me.on('click', function() {
        app.leanTaskView = new app.LeanTaskView();
      });
    };

    togglePassTickets();
  });
