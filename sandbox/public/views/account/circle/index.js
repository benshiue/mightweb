/**
 * SETUP
 **/
  var app = app || {};

/**
 * MODELS
 **/
// To be fixed.
  app.Idea = Backbone.Model.extend({
    url: '/1/school',
    defaults: {
      errors: [],
      errfor: {},
      ideas: []
    }
  });

/**
 * VIEWS
 **/

/***********************************************************************************/
// To be fixed.
  app.IdeaView = Backbone.View.extend({
    el: '#schools',
    template: _.template( $('#tmpl-idea-item').html() ),
    events: {
    },
    initialize: function() {
        this.model = new app.Idea();
        this.listenTo(this.model, 'sync', this.render);
        this.listenTo(this.model, 'change', this.render);
        this.listUserIdeas();
    },
    render: function() {
        this.$el.html(this.template( this.model.toJSON() ));
    },
    listUserIdeas: function() {
        var self = this;
        $.ajax({
            type: "GET",
            url: '/1/school?type=all',
            data: '',
            success: function( response ) {
              if (!response.success) return;

              self.model.set('schools', response.data);
            }
        });
    }
  });
/***********************************************************************************/

/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.ideaView = new app.IdeaView();
  });
