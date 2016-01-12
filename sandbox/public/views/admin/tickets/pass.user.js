/**
 * 使用者票券管理: 列出我的票券
 */

/**
 * SETUP
 **/
  var app = app || {};



/**
 * MODELS
 **/
  app.Pass = Backbone.Model.extend({
    url: function() {
      return '/1/pass';
    },
    defaults: {
      success: false,
      errors: [],
      errfor: {},

      passes: []
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
      this.model = new app.Pass();

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
    }
  });

/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.passView = new app.PassView();
  });
