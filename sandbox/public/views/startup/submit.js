/**
 * SETUP
 **/
  var app = app || {};



/**
 * MODELS
 **/
  app.Contact = Backbone.Model.extend({
    url: function() {
      return '/1/idea';
    },
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      idea: '',
      founder: '',
      description: '',
      facebook: '',
      github: '',
      twitter: '',
      email: ''
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
        this.$el.find('.btn-contact').removeClass('btn-warning').addClass('disabled').text('寄出中 ...');

        // isNew ?
        var id = this.$el.find('[name="id"]').val();
        if (id !== 'undefined') { // PUT (update)
          this.model.save({
              id: this.$el.find('[name="id"]').val(),
              idea: this.$el.find('[name="idea"]').val(),
              founder: this.$el.find('[name="founder"]').val(),
              description: this.$el.find('[name="description"]').val(),
              facebook: this.$el.find('[name="facebook"]').val(),
              github: this.$el.find('[name="github"]').val(),
              twitter: this.$el.find('[name="twitter"]').val(),
              email: this.$el.find('[name="email"]').val()
          });
        } else { // POST (create)
          this.model.save({
              idea: this.$el.find('[name="idea"]').val(),
              founder: this.$el.find('[name="founder"]').val(),
              description: this.$el.find('[name="description"]').val(),
              facebook: this.$el.find('[name="facebook"]').val(),
              github: this.$el.find('[name="github"]').val(),
              twitter: this.$el.find('[name="twitter"]').val(),
              email: this.$el.find('[name="email"]').val()
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
