/**
 * SETUP
 **/
  var app = app || {};



/**
 * MODELS
 **/
  app.Contact = Backbone.Model.extend({
    url: '/contact',
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      name: '',
      email: '',
      phone: '',
      message: ''
    }
  });



/**
 * VIEWS
 **/
  app.ContactView = Backbone.View.extend({
    el: '#contact',
    template: _.template( $('#tmpl-contact').html() ),
    events: {
        'submit form': 'preventSubmit',
        'click .btn-contact': 'contact'
    },
    initialize: function() {
        this.model = new app.Contact();
        this.listenTo(this.model, 'sync', this.render);
        this.render();
    },
    render: function() {
        this.$el.html(this.template( this.model.attributes ));
    },
    preventSubmit: function(event) {
        event.preventDefault();
    },
    contact: function() {
        this.$el.find('.btn-contact').removeClass('btn-primary').addClass('disabled').text('寄出中 ...');

        this.model.save({
            name: this.$el.find('[name="name"]').val(),
            email: this.$el.find('[name="email"]').val(),
            phone: this.$el.find('[name="phone"]').val(),
            message: this.$el.find('[name="message"]').val()
        });
    }
  });



/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.contactView = new app.ContactView();
  });


