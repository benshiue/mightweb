/**
 * SETUP
 **/
  var app = app || {};



/**
 * MODELS
 **/
  app.Contact = Backbone.Model.extend({
    url: function() {
      return '/1/pass';
    },
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      subject: '',
      description: ''
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
        this.$el.find('.btn-contact').removeClass('btn-warning').addClass('disabled').text('Saving ...');

        // isNew ?
        var id = this.$el.find('[name="id"]').val();
        if (id !== 'undefined') { // PUT (update)
          this.model.save({
              id: this.$el.find('[name="id"]').val(),
              subject: this.$el.find('[name="subject"]').val(),
              description: this.$el.find('[name="description"]').val()
          });
        } else { // POST (create)
          this.model.save({
              subject: this.$el.find('[name="subject"]').val(),
              description: this.$el.find('[name="description"]').val()
          });

        }
    }
  });

/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.contactView = new app.ContactView();
  });
