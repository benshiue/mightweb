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
      fullname: '',
      email: '',
      mobile: '',
      company: '',
      title: ''
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
        'click .btn-save': 'contact'
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
    save: function() {
        this.$el.find('.btn-save').removeClass('btn-primary').addClass('disabled').text('寄出中 ...');

        this.model.save({
            fullname: this.$el.find('[name="fullname"]').val(),
            email: this.$el.find('[name="email"]').val(),
            mobile: this.$el.find('[name="mobile"]').val(),
            company: this.$el.find('[name="company"]').val(),
            title: this.$el.find('[name="title"]').val()
        });
    }
  });



/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.contactView = new app.ContactView();
  });


