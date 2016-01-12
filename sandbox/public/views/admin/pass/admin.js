/**
 * SETUP
 **/
  var app = app || {};

/**
 * MODELS
 **/
// To be fixed.
  app.Subscription = Backbone.Model.extend({
    url: '/1/subscription',
    defaults: {
      errors: [],
      errfor: {},
      subscriptions: []
    }
  });

/**
 * VIEWS
 **/

/***********************************************************************************/
// To be fixed.
  app.SubscriptionView = Backbone.View.extend({
    el: '#subscriptions',
    template: _.template( $('#tmpl-subscription-item').html() ),
    events: {
    },
    initialize: function() {
        this.model = new app.Subscription();
        this.listenTo(this.model, 'sync', this.render);
        this.listenTo(this.model, 'change', this.render);
        this.listUserSubscriptions();
    },
    render: function() {
        this.$el.html(this.template( this.model.toJSON() ));

        $('.btn-delete').each(function() {
            var me = $(this);

            var remove = function() {
                var _id = me.data('subscription-id')
                    , href = '/1/subscription/' + _id

                me.text(" Deleting...");

                $.ajax({
                    type: "DELETE",
                    url: href,
                    success: function( response ) {
                      if (!response.success) return;

                      alert('已刪除。');
                    }
                });
            };

            me.on('click', function() {
                remove();
            });
        });
    },
    listUserSubscriptions: function() {
        var self = this;
        $.ajax({
            type: "GET",
            url: '/1/subscription',
            data: '',
            success: function( response ) {
              if (!response.success) return;

              self.model.set('subscriptions', response.data);
            }
        });
    }
  });
/***********************************************************************************/

/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.SubscriptionView = new app.SubscriptionView();
  });
