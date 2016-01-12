/**
 * SETUP
 **/
  var app = app || {};



/**
 * MODELS
 **/
  app.Pass = Backbone.Model.extend({
    id: undefined,
    url: function() {
      return '/1/pass/' + this.id;
    },
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      pass: {
        subject: '',
        description: '',
        mailchimpListId: ''
      }
    }
  });



/**
 * VIEWS
 **/
  app.PassView = Backbone.View.extend({
    el: '#pass',
    template: _.template( $('#tmpl-pass').html() ),
    events: {
        'submit form': 'preventSubmit',
        'click .btn-save': 'save'
    },
    initialize: function() {
        this.model = new app.Pass();
    },
    syncUp: function() {
        //this.listenTo(this.model, 'sync', this.render);
        this.listenTo(this.model, 'change', this.render);

        this.render();
    },
    render: function() {
        this.$el.html(this.template( this.model.attributes ));
        //alert( JSON.stringify(this.model.attributes) );
    },
    preventSubmit: function(event) {
        event.preventDefault();
    },
    save: function() {
        this.$el.find('.btn-save').removeClass('btn-warning').addClass('disabled').text('Saving ...');

        // 新的資訊
        // render 後 (underscore template) 將會重設 model state，包含 id 欄位（但已取得的 data 不會被重設）
        // 必須重新指定 id，才能更新 (PUT) 資訊
        var pass = this.model.get('pass');

        this.model.save({
          id: pass._id,
          subject: this.$el.find('[name="subject"]').val(),
          description: this.$el.find('[name="description"]').val(),
          mailchimpListId: this.$el.find('[name="mailchimpListId"]').val()
        });
    }
  });

/*
 * ROUTES
 */
app.PassRoutes = Backbone.Router.extend({
    routes: {
      ":id": "passById",
      // http://www.mokoversity.com/tickets/admin#534b7c7bcec343cf5b00000a
    },

    passById: function(id) {
      app.passView = new app.PassView();
      var pass = new app.Pass({id: id});
      pass.fetch({
        success: function(model, response, options) {
          //me.find('.status-loading').addClass('hide');
          //alert(JSON.stringify(model.attributes.pass));

          // 只 set 此欄位，不能 set 整個 model
          // 會影響 sucesss 初始值，導致 template 流程錯誤
          app.passView.model.set('pass', model.attributes.pass);
          app.passView.syncUp();
          //app.passView.model = model;
        }
      });
    }
});

/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.passRoutes = new app.PassRoutes();
    Backbone.history.start();
  });
