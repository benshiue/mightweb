/**
 * SETUP
 **/
  var app = app || {};


/**
 * MODELS
 **/
  app.Subscribe = Backbone.Model.extend({
    url: function() {
        return '/1/subscription/' + this.attributes.id + '/newsletter?email=' + this.attributes.email;
    },
    defaults: {
      success: false,
      errors: [],
      errfor: {},

      email: ''
    }
  });

/**
 * VIEWS
 **/
  app.SubscribeView = Backbone.View.extend({
    el: '#submit-section', 
    events: {
      'click [data-subscription=submit]': 'save'
    },
    initialize: function() {
      this.model = new app.Subscribe();
    },
    render: function() {
    },
    save: function(e) {
        var me = this.$el.find(e.target)
            , id = me.data('id')
            , target = "input[data-id='" + id + "']"
            , email = this.$el.find(target).val().trim()
            , self = this;

        e.preventDefault();

        me.addClass('hide');
        this.$el.find('#saving').removeClass('hide');

        // TODO: refactor
        this.model.set('id', id);
        this.model.set('email', email);

        this.model.save(null, {
            success: function(model, response, options) {
                self.$el.addClass('hide');
                $('#notification').removeClass('hide');

                $.notify('課程登記確認信已發出', { position: 'bottom right', className: 'info' });  
            },
            error: function(model, response, options) {
                $.notify('Email 有問題', { position: 'bottom right', className: 'error' });  
            }
        })
    }
  });

/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.subscribeView = new app.SubscribeView();
  });
