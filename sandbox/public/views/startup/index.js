/**
 * SETUP
 **/
  var app = app || {};



/**
 * MODELS
 **/
  app.Contact = Backbone.Model.extend({
    url: '/startup/apply',
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      name: '',
      email: '',
      phone: '',
      companyName: '',
      companyUrl: '',
      members: '',
      idea: '',
      profile: '',
      features: '',
      competitors: '',
      businessModel: '',
      money: ''
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

        this.model.save({
            name: this.$el.find('[name="name"]').val(),
            email: this.$el.find('[name="email"]').val(),
            phone: this.$el.find('[name="phone"]').val(),
            companyName: this.$el.find('[name="companyName"]').val(),
            companyUrl: this.$el.find('[name="companyUrl"]').val(),
            members: this.$el.find('[name="members"]').val(),
            idea: this.$el.find('[name="idea"]').val(),
            profile: this.$el.find('[name="profile"]').val(),
            features: this.$el.find('[name="features"]').val(),
            competitors: this.$el.find('[name="competitors"]').val(),
            businessModel: this.$el.find('[name="businessModel"]').val(),
            money: this.$el.find('[name="money"]').val()
        });
    }
  });


/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.contactView = new app.ContactView();
  });


