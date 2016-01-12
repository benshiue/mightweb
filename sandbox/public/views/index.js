/**
 * SETUP
 **/
  var app = app || {};



/**
 * MODELS
 **/
  app.Latest = Backbone.Model.extend({
    url: '/',
    defaults: {
      errors: [],
      errfor: {}
    }
  });


/**
 * VIEWS
 **/
  app.LatestView = Backbone.View.extend({
    el: '#latest',
    template: _.template( $('#tmpl-latest').html() ),
    events: {
    },
    initialize: function() {
      this.model = new app.Latest();
      this.listenTo(this.model, 'sync', this.render);
      this.render();
      this.composite();
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));
    },
    composite: function() {
      validateLatest();
    },
  });


/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.latestView = new app.LatestView();
  });


/**
 * API: /api/program/latest
 * Return:
 *  {
 *   "success": true,
 *   "errors": [],
 *   "errfor": {},
 *   "program": [{
 *     "lecture": "000P0106_OpenCallback",
 *     "_id": "51cbd72bc5ac0f0446000035",
 *     "views": 7,
 *     "date": "2013-06-27T06:09:47.393Z",
 *     "author": ""
 *   }]
 * }
 */
var validateLatest = function() {
  $("[data-tag-follow='lesson']").each(function() {
    var me = $(this);
    var isFollowed = false;
    var lesson = me.data('lesson-name');

    $.ajax({
        type: "GET",
        url: '/api/program/list',
        success: function( response ) {
            if (response.success) {
                if (response.data.length) me.removeClass('hide');
            }
        },
    });
  });
}
