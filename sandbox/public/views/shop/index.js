/**
 * SETUP
 **/
  var app = app || {};



/**
 * MODELS
 **/
  app.Contact = Backbone.Model.extend({
    url: '/shop/mbed/contact',
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      name: '',
      email: '',
      phone: '',
      address: '',
      message: '例如：發票統編資訊、發票地址等',
      archProQty: 1,
      starterKitQty: 1
    }
  });



/**
 * VIEWS
 **/
  app.ContactView = Backbone.View.extend({
    el: '#order',
    template: _.template( $('#tmpl-order-form').html() ),    
    events: {
      'click .btn-contact': 'contact',
      'change #archProQty': 'performQuote',
      'change #starterKitQty': 'performQuote'
    },
    initialize: function() {
      this.model = new app.Contact();
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template( this.model.toJSON() ));      
    },
    contact: function() {
        event.preventDefault();

        $.notify('傳送訂單中...', { position: 'bottom right', className: 'info' });
        this.$el.find('.btn-contact').removeClass('btn-primary').addClass('disabled').text('寄出中 ...');

        this.model.set('name', this.$el.find('[name="name"]').val() );
        this.model.set('email', this.$el.find('[name="email"]').val() );
        this.model.set('phone', this.$el.find('[name="phone"]').val() );
        this.model.set('address', this.$el.find('[name="address"]').val() );
        this.model.set('archProQty', this.$el.find('[name="archProQty"]').val() );
        this.model.set('starterKitQty', this.$el.find('[name="starterKitQty"]').val() );
        this.model.set('message', this.$el.find('[name="message"]').val() );

        this.model.save({
          success: function(model, response, options) {
          },
          error: function(model, response, options) {
          }
        });
    },
    performQuote: function(ev) {
      this.model.set('name', this.$el.find('[name="name"]').val() );
      this.model.set('email', this.$el.find('[name="email"]').val() );
      this.model.set('phone', this.$el.find('[name="phone"]').val() );
      this.model.set('address', this.$el.find('[name="address"]').val() );
      this.model.set('archProQty', this.$el.find('[name="archProQty"]').val() );
      this.model.set('starterKitQty', this.$el.find('[name="starterKitQty"]').val() );
      this.model.set('message', this.$el.find('[name="message"]').val() );

      this.render();
    }
  });



/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.contactView = new app.ContactView();
  });


