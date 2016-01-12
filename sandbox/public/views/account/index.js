/**
 * SETUP
 **/
  var app = app || {};



/**
 * MODELS
 **/
  app.Account = Backbone.Model.extend({
    url: '/account',
    defaults: {
      errors: [],
      errfor: {},
      email: ''
    }
  });

  app.Program = Backbone.Model.extend({
    url: '/account',
    defaults: {
      errors: [],
      errfor: {},
      programs: []
    }
  });

  app.Following = Backbone.Model.extend({
    url: '/account',
    defaults: {
      errors: [],
      errfor: {},
      following: []
    }
  });

/**
 * VIEWS
 **/
  app.AccountView = Backbone.View.extend({
    el: '#following',
    template: _.template( $('#tmpl-following').html() ),
    events: {
    },
    initialize: function() {
      this.model = new app.Following();
      this.listenTo(this.model, 'sync', this.render);
      this.listenTo(this.model, 'change', this.render);
      this.validateFollowing();
    },
    render: function() {
      this.$el.html(this.template( this.model.toJSON() ));
    },
    validateFollowing: function() {
      var self = this;
      var username = this.$el.data('username');
      $.ajax({
          type: "GET",
          url: '/api/user/following',
          data: 'username=' + username,
          success: function( response ) {
            if (!response.success) return;

            self.model.set('following', response.following);
          }
      });
    },
    validateFollows_deprecated: function() {
      $("[data-tag-follow='lesson']").each(function() {
        var me = $(this);
        var isFollowed = false;
        var lesson = me.data('lesson-name');

        $.ajax({
            type: "GET",
            url: '/api/lesson/isfollowed',
            data: 'lesson=' + lesson,
            success: function( response ) {
                if (response.success === true
                    && response.isfollowed === true) {
                    me.removeClass('hide');
                }
            },
        });
      });
    }
  });

  app.ProgramView = Backbone.View.extend({
    el: '#new-programs',
    template: _.template( $('#tmpl-new-programs').html() ),
    events: {
    },
    initialize: function() {
      this.model = new app.Program();
      this.listenTo(this.model, 'sync', this.render);
      this.listNewPrograms();
      //this.render();
    },
    render: function() {
      this.$el.html(this.template( this.model.toJSON() ));
    },
    listNewPrograms: function() {
        var self = this;
        $.ajax({
            type: "GET",
            url: '/api/program/list',
            data: 'type=&limit=5&sort=-date',
            success: function( response ) {
              if (!response.success) return;

              for (i = 0; i < response.data.length; i++) {
                var d = moment(response.data[i].date).format('MMMM Do YYYY, h:mm:ss a');
                response.data[i].date = d;
              }
              self.model.set('programs', response.data);
            }
        });
    }
  });


/**
 * BOOTUP
 **/
$(document).ready(function() {
  app.accountView = new app.AccountView();
  app.programView = new app.ProgramView();

  toggleBoxes();
});

var toggleBoxes = function() {
  // follow button handler
  $("input[data-tag='subscription']").each(function() {
      var me = $(this)
        , myId = me.attr('id')
        , _id = me.data('id')   // subscription id
        , label = $('label[for=' + myId + ']')
        , textSpan = $('span[data-id=' + _id + ']')
        , subject = ''
        , msgSubscribe = ' (訂閱中)'
        , msgUnsubscribe = ' (尚未訂閱)'
        , isSubscriber = true;

      // get subject
      $.ajax({
          type: "GET",
          url: '/1/subscription/' + _id,
          success: function( response ) {
            if (response.success !== true) return;
            subject = response.data.subject;

            // get isSubscriber
            $.ajax({
                type: "GET",
                url: '/1/subscription/' + _id + '/subscribers',
                success: function( response ) {
                  if (response.success !== true) return;

                  isSubscriber = response.isSubscriber;

                  if (isSubscriber === true) {
                    textSpan.html(subject + msgSubscribe);

                    me.checkbox('check');  // Flat UI API (see: flatui-checkbox.js)
                  } else {
                    textSpan.html(subject + msgUnsubscribe);
                    me.checkbox('uncheck');
                  }
                },
                complete: function (response) {
                  me.on('change', function() {
                    var change = function() {
                      var checked = me.prop('checked');

                      if (checked === true) {
                          $.ajax({
                              type: "PUT",
                              url: '/1/subscription/' + _id + '/subscribe',
                              success: function( response ) {
                                if (!response.success) return;
                                textSpan.html(subject + msgSubscribe);
                                $.notify('已儲存變更: ' + subject + msgSubscribe, { position: 'bottom right', className: 'success' });
                              }
                          });
                      } else if (checked === false) {
                          $.ajax({
                              type: "PUT",
                              url: '/1/subscription/' + _id + '/unsubscribe',
                              success: function( response ) {
                                if (!response.success) return;
                                textSpan.html(subject + msgUnsubscribe);
                                $.notify('已儲存變更: ' + subject + msgUnsubscribe, { position: 'bottom right', className: 'error' });
                              }
                          });
                      }
                    };

                    change();
                  });
                }
            });
          },
          complete: function (response) {
          }
      });
  });
};
