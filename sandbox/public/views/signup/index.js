/**
 * SETUP
 **/
var app = app || {};


/**
 * MODELS
 **/
  app.Signup = Backbone.Model.extend({
    url: '/signup',
    defaults: {
      errors: [],
      errfor: {},
      username: '',
      email: '',
      password: '',
      isSignOff: false,
      isSending: false
    }
  });


/**
 * VIEWS
 **/
app.SignupView = Backbone.View.extend({
    el: '#signup',
    template: _.template( $('#tmpl-signup').html() ),
    events: {
        'submit form': 'preventSubmit',
        'keypress [name="password"]': 'signupOnEnter',
        'click .btn-signup': 'signup',
        'click #signoffagreement': 'signoff',
        'click #showagreement': 'showagreement'
    },
    initialize: function() {
        this.model = new app.Signup();
        this.listenTo(this.model, 'sync', this.render);
        this.render();
    },
    render: function() {
        this.$el.html(this.template( this.model.attributes ));
        if (this.model.get('isSignOff')) this.signoff();
        this.$el.find('.btn-signup').attr('disabled', this.model.get('isSending'));
        this.$el.find('[name="username"]').focus();
    },
    preventSubmit: function(event) {
        event.preventDefault();
    },
    signupOnEnter: function(event) {
        if (event.keyCode != 13) return;
        if ($(event.target).attr('name') !== 'password' || app.signupView.model.get('isSignOff') !== true) return;

        event.preventDefault();
        this.signup();
    },
    signup: function() {
        this.$el.find('.btn-signup').attr('disabled', true);
        this.$el.find('#notification').removeClass('hide');

        this.model.set({ 'isSending': true }, { silent: true });

        this.model.save({
                username: this.$el.find('[name="username"]').val(),
                email: this.$el.find('[name="email"]').val(),
                password: this.$el.find('[name="password"]').val()
            },{
            success: function(model, response, options) {
                if (response.success) {
                    location.href = '/account';
                } else {
                    response.isSending = false;
                    model.set(response);
                }
            }
        });
    },
    signoff: function() {
        this.$el.find('.btn-signup').prop('disabled', false);
        this.$el.find('.btn-signup').addClass('btn-primary');
        this.$el.find('.btn-signup i').removeClass('fui-lock');
        this.$el.find('.btn-signup i').addClass('fui-user');

        // We don't want user to uncheck it again.
        this.$el.find('#signoffagreement').remove();
        this.$el.find('#commitsignoff').addClass('icon-ok');
        this.model.set( {'isSignOff': true}, {silent: true} );
    },
    showagreement: function(e) {
        e.preventDefault();
        this.$el.find('#agreement').toggleClass('hide');
    }
});


/**
 * BOOTUP
 **/
$(document).ready(function() {
    app.signupView = new app.SignupView();
});


