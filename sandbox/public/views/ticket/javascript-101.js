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

      $.notify("傳送驗證碼至: " + self.verify.get('phone'), { 
        position: 'bottom right', className: 'success' 
      });

      self.verify.save(self.verify.attributes, {
        success: function(model, response, options) {
            if (response.success === false)
              return $.notify("驗證碼傳送失敗", { position: 'bottom right', className: 'error' });
            $.notify("驗證碼傳送成功", { position: 'bottom right', className: 'success' });
        },
        error: function(model, response, options) {
            $.notify("伺服器錯誤，請通知系統管理員。", { position: 'bottom right', className: 'error' });
        }
      });

      complete();
    }
  });

/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.leanTaskView = new app.LeanTaskView();

    // data tags
    var togglePassTickets = function() {
      var me = $('[data-pass-tickets]');
      var passId = me.data('pass-tickets');

      if (typeof(passId) !== 'undefined') {
        $.ajax({
          url: '/1/pass/' + passId + '/info',
          type: 'GET',
          dataType: "json",
          success: function (data, textStatus, jqXHR) {
            me.html(data.pass.numTickets);
          }
        });
      }
    };

    togglePassTickets();
  });
