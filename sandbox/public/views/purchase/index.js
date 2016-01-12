/**
 * SETUP
 **/
  var app = app || {};



/**
 * MODELS
 **/
  app.Purchase = Backbone.Model.extend({
    url: '/1/order/user',
    defaults: {
      success: true,
      errors: [],
      errfor: {},
      orders: [{
          _id: '',
          productId: {
              _id: '',
              download_path: '',
              date: '',
              price: 0,
              name: ''
          },
          paypal: {
              links: {
                  approval_url: "#"
              }
          },
          isVerified: false
      }]
    }
  });

/**
 * VIEWS
 **/
  app.PurchaseView = Backbone.View.extend({
    el: '#purchase',
    template: _.template( $('#tmpl-purchase').html() ),
    events: {
    },
    initialize: function() {
      this.model = new app.Purchase();
      this.listenTo(this.model, 'sync', this.render);
      this.listenTo(this.model, 'change', this.render);
      this.syncUp();
    },
    render: function() {
      this.$el.html(this.template( this.model.toJSON() ));

      this.$el.find('.purchase-date').each(function(key, value) {
          value.innerText = moment(value.innerText).format('YYYY-MM-DD');
      });
    },
    syncUp: function() {
      this.model.fetch();
    }
  });

/**
 * BOOTUP
 **/
$(document).ready(function() {
  app.purchaseView = new app.PurchaseView();
});

