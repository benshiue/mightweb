/**
 * SETUP
 **/
  var app = app || {};

/**
 * MODELS
 **/
  app.Record = Backbone.Model.extend({
    idAttribute: '_id',
    url: function() {
      return '/1/idea' + (this.isNew() ? '' : '/' + this.id);
    },
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      idea: '',
      founder: '',
      description: '',
      facebook: '',
      github: '',
      twitter: '',
      email: '',
      time: '',
      isActive: true
    }
  });

app.RecordCollection = Backbone.Collection.extend({
    model: app.Record,
    url: '/1/idea',
    parse: function(results) {
        app.pagingView.model.set({
            pages: results.pages,
            items: results.items
        });
        app.filterView.model.set(results.filters);
        return results.data;
    }
});

app.Filter = Backbone.Model.extend({
    defaults: {
        search: '',
        status: '',
        sort: '',
        limit: ''
    }
});

app.Paging = Backbone.Model.extend({
    defaults: {
        pages: {},
        items: {}
    }
});

/***********************************************************************************/
// To be fixed.
  app.UserIdea = Backbone.Model.extend({
    url: '/1/idea',
    defaults: {
      errors: [],
      errfor: {},
      ideas: []
    }
  });

  app.UserIdeaView = Backbone.View.extend({
    el: '#ideas',
    template: _.template( $('#tmpl-idea-item').html() ),
    events: {
    },
    initialize: function() {
        this.model = new app.Idea();
        this.listenTo(this.model, 'sync', this.render);
        this.listenTo(this.model, 'change', this.render);
        this.listUserIdeas();
    },
    requestInvalidate: function() {
        //this.$el.html(this.template( this.model.toJSON() ));
    },
    render: function() {
        this.$el.html(this.template( this.model.toJSON() ));

        $('.btn-publish').each(function() {
            var me = $(this);

            var publish = function() {
                var publishMsg = ' Publish (將想法公開)'
                    , unpublishMsg = ' Unpublish (將想法下線)'
                    , _id = me.data('idea-id')
                    , status = me.data('toggle')
                    , href = '/1/idea/' + _id;

                me.text(" Saving...");

                if (status === 'publish') {
                    $.ajax({
                        type: "PUT",
                        url: href + '/publish',
                        success: function( response ) {
                          if (!response.success) return;

                          me.text(unpublishMsg);
                          me.data('toggle', 'unpublish')

                          $.notify("創業想法已公開在網站上。", { position: 'bottom right', className: 'success'  });
                        }
                    });
                } else {
                    $.ajax({
                        type: "PUT",
                        url: href + '/unpublish',
                        success: function( response ) {
                          if (!response.success) return;

                          me.text(publishMsg);
                          me.data('toggle', 'publish')

                          $.notify("創業想法將暫時下線，重新 Publish 即可公開在網站上。", { position: 'bottom right', className: 'error' });
                        }
                    });
                }

                // invalidate views
                requestInvalidate();
            }

            me.on('click', function() {
                publish();
            });
        });
    },
    listUserIdeas: function() {
        var self = this;
        $.ajax({
            type: "GET",
            url: '/1/idea',
            data: '',
            success: function( response ) {
              if (!response.success) return;

              self.model.set('ideas', response.data);
            }
        });
    }
  });
/***********************************************************************************/

/**
 * VIEWS
 **/

/**
app.FilterView = Backbone.View.extend({
    el: '#filters',
    template: _.template($('#tmpl-filters').html()),
    events: {
        'submit form': 'preventSubmit',
        'keypress input[type="text"]': 'filterOnEnter',
        'change select': 'filter'
    },
    initialize: function() {
        this.model = new app.Filter(app.mainView.results.filters);
        this.listenTo(this.model, 'sync', this.render);
        this.render();
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));

        //set field values
        for (var key in this.model.attributes) {
            this.$el.find('[name="' + key + '"]').val(this.model.attributes[key]);
        }
    },
    preventSubmit: function(event) {
        event.preventDefault();
    },
    filterOnEnter: function(event) {
        if (event.keyCode != 13) return;
        this.filter();
    },
    filter: function() {
        var query = $('#filters form').serialize();
        Backbone.history.navigate('q/' + query, {trigger: true});
    }
});

app.PagingView = Backbone.View.extend({
    el: '#results-paging',
    template: _.template($('#tmpl-results-paging').html()),
    events: {
        'click .btn-page': 'goToPage'
    },
    initialize: function() {
        this.model = new app.Paging({pages: app.mainView.results.pages, items: app.mainView.results.items});
        this.listenTo(this.model, 'sync', this.render);
        this.render();
    },
    render: function() {
        if (this.model.get('pages').total > 1) {
            this.$el.html(this.template(this.model.attributes));

            if (!this.model.get('pages').hasPrev) {
                this.$el.find('.btn-prev').attr('disabled', 'disabled');
            }
            if (!this.model.get('pages').hasNext) {
                this.$el.find('.btn-next').attr('disabled', 'disabled');
            }
        }
        else {
            this.$el.empty();
        }
    },
    goToPage: function(event) {
        var query = $('#filters form').serialize() + '&page=' + $(event.target).data('page');
        Backbone.history.navigate('q/' + query, {trigger: true});
        var body = $('body').scrollTop(0);
    }
});

app.ResultsView  = Backbone.View.extend({
    el: '#results',
    initialize: function() {
        this.collection = new app.RecordCollection(app.mainView.results.data);
        this.listenTo(this.collection, 'reset', this.render);
        this.render();
    },
    render: function() {
        this.collection.each(function(record) {
            var view = new app.ResultsItemView({model: record});
            this.$el.append(view.render().$el);
        }, this);
    }
});

app.ResultsItemView = Backbone.View.extend({
    template: _.template($('tmpl-results-item').html()),
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});

app.MainView = Backbone.View.extend({
    initialize: function() {
        app.mainView = this;

        //sub views
        app.resultsView = new app.ResultsView();
        app.resultsView.collection.fetch({reset: true});
    }
});
**/

/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.userIdeaView = new app.UserIdeaView();
  });
