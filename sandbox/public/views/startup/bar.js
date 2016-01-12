/**
 * SETUP
 **/
  var app = app || {};

/**
 * MODELS
 **/
// To be fixed.
  app.Idea = Backbone.Model.extend({
    url: function() {
    	return '/1/idea?type=all'
    },
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
    el: '#ideas',
    template: _.template( $('#tmpl-idea-item').html() ),
    events: {
    },
    initialize: function() {
    	var self = this;

      this.model = new app.Idea();
      this.listenTo(this.model, 'sync', this.render);
      this.listenTo(this.model, 'change', this.render);

      this.model.fetch({
      	success: function(model, response, options) {
      		self.model.set('ideas', response.data);
          console.log(response.data);
      	}
      });
    },
    render: function() {
        this.$el.html(this.template( this.model.toJSON() ));
    }
  });
/***********************************************************************************/

/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.ideaView = new app.IdeaView();

    (function() {
      $('#main-menu').addClass('hide');

      $('.hero-unit').waypoint(function(direction) {
        $('#main-menu').removeClass('hide');
        $("#main-menu").css('background', 'rgba(0, 0, 0, 0.75)');
      });
    })();

  });
