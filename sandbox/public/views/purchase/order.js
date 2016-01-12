/**
 * SETUP
 **/
  var app = app || {};

/**
 * MODELS
 **/
  app.Product = Backbone.Model.extend({
    url: function() {
      return '/1/product/' + this.attributes.productId
    },
    defaults: {
      productId: ''
    }
  });

/**
 * VIEWS
 **/
  app.OrderView = Backbone.View.extend({
    el: '#purchase',
    events: {
      'click button[data-product-id]': 'placeOrder'
    },
    initialize: function() {
      this.model = new app.Product();
    },
    placeOrder: function(e) {
      var me = this.$el.find(e.target);
      var productId = me.data('product-id');
      var status = $('#purchase-processing');
      var done = $('#purchase-done');

      this.model.set('productId', productId);

      status.removeClass('hide');
      this.$el.addClass('hide');

      this.model.save(this.model.attributes, {
        success: function(model, response, options) {
            if (response.success === false) {
              $.notify("有點問題...", { position: 'bottom right', className: 'error' });
            } else {
              $.notify("已收到您的訂單", { position: 'bottom right', className: 'info' });
              status.addClass('hide');
              done.removeClass('hide');
            }
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
  app.orderView = new app.OrderView();
});

