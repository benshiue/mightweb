/**
 * SETUP
 **/
  var app = app || {};



/**
 * MODELS
 **/
  app.Contact = Backbone.Model.extend({
    url: function() {
      return '/1/school';
    },
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      name: '',
      dean: '',
      description: '',
      line: '',
      wechat: '',
      whatsapp: '',
      facebook: ''
    }
  });



/**
 * VIEWS
 **/
  app.ContactView = Backbone.View.extend({
    el: '#school',
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
        this.$el.find('.btn-contact').removeClass('btn-warning').addClass('disabled').text('儲存中 ...');

        // isNew ?
        var id = this.$el.find('[name="id"]').val();
        if (id !== '') { // PUT (update)
          this.model.save({
              id: this.$el.find('[name="id"]').val(),
              name: this.$el.find('[name="name"]').val(),
              dean: this.$el.find('[name="dean"]').val(),
              description: this.$el.find('[name="description"]').val(),
              line: this.$el.find('[name="line"]').val(),
              wechat: this.$el.find('[name="wechat"]').val(),
              whatsapp: this.$el.find('[name="whatsapp"]').val(),
              facebook: this.$el.find('[name="facebook"]').val()
          });
        } else { // POST (create)
          this.model.save({
              name: this.$el.find('[name="name"]').val(),
              dean: this.$el.find('[name="dean"]').val(),
              description: this.$el.find('[name="description"]').val(),
              line: this.$el.find('[name="line"]').val(),
              wechat: this.$el.find('[name="wechat"]').val(),
              whatsapp: this.$el.find('[name="whatsapp"]').val(),
              facebook: this.$el.find('[name="facebook"]').val()
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
