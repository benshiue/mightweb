/**
 * SETUP
 **/
  var app = app || {};


/**
 * MODELS
 **/
  app.LeanTask = Backbone.Model.extend({
    url: function() {
      return '/1/idea';
    },
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      code: '',
      objective: ''
    }
  });



/**
 * VIEWS
 **/
  app.LeanTaskView = Backbone.View.extend({
    el: '#leanTasks',
    template: _.template( $('#tmpl-lean-task').html() ),
    events: {
    },
    initialize: function() {
      this.model = new app.LeanTask();
      this.listenTo(this.model, 'sync', this.render);
      this.render();

    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));

      this.landing();
    },
    landing: function() {
      $("div[data-toggle='lean-task']").each(function() {
          var me = $(this)
            , ideaId = me.data('idea-id')
            , lessonCode = me.data('lesson-code')
            , taskObjective = me.attr('name')
            , converter = new Showdown.converter();

          $.ajax({
            url: '/1/lean/idea/' + ideaId + '/' + lessonCode + '/' + taskObjective,
            type: 'GET',
            dataType: "json",
            success: function (data, textStatus, jqXHR) {

              // parse markdown
              if (data.task.description) {
                  var html = converter.makeHtml(data.task.description);
              }

              me.html(html);
              me.append(' (Revision: ' + data.debug.revision + ')');
            },
            complete: function (data, textStatus, jqXHR) {
            }
          });
      });
    }
  });

/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.LeanTaskView = new app.LeanTaskView();
  });
