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
        'submit form': 'preventSubmit',
        'click .btn-lean-task': 'LeanTask'
    },
    initialize: function() {
      this.model = new app.LeanTask();
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));

      this.formInit();
      this.toggle();
    },
    preventSubmit: function(event) {
      event.preventDefault();
    },
    formInit: function() {
      $("button[data-toggle='lean-task']").each(function() {
          var me = $(this);

          var taskObjective = me.data('target-name')
            , controlObj = $('.form-control[name="' + taskObjective + '"]')

            , ideaId = controlObj.data('idea-id')
            , lessonCode = controlObj.data('lesson-code')
            , taskObjective = controlObj.attr('name')
            , taskDescription = controlObj.val();

          $.ajax({
            url: '/1/lean/idea/' + ideaId + '/' + lessonCode + '/' + taskObjective,
            type: 'GET',
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
              controlObj.val(data.task.description);
            },
            complete: function (data, textStatus, jqXHR) {
            }
          });
      });
    },
    toggle: function() {
      $("button[data-toggle='lean-task']").each(function() {
          var me = $(this);

          me.on('click', function() {
            var taskObjective = me.data('target-name')
              , controlObj = $('.form-control[name="' + taskObjective + '"]')

              , ideaId = controlObj.data('idea-id')
              , lessonCode = controlObj.data('lesson-code')
              , taskObjective = controlObj.attr('name')
              , taskDescription = controlObj.val();

            me.text('Saving ...');

            $.ajax({
              url: '/1/lean/idea/' + ideaId,
              type: 'POST',
              data: { ideaId: ideaId
                      , code: lessonCode
                      , description: taskDescription
                      , objective: taskObjective },
              dataType: "json",
              success: function (data, textStatus, jqXHR) {
              },
              complete: function (data, textStatus, jqXHR) {
                me.text('儲存');
                $.notify(taskObjective + ": 已儲存成功", { position: 'bottom right', className: 'success' });
              }
            });
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
