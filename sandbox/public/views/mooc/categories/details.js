/**
 * SETUP
 **/
var app = app || {};


/**
 * MODELS
 **/
app.Category = Backbone.Model.extend({
    idAttribute: '_id',
    url: function() {
        return '/mooc/categories/' + this.id;
    }
});

app.Delete = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
        success: false,
        errors: [],
        errfor: {}
    },
    url: function() {
        return '/mooc/categories/' + app.mainView.model.id;
    }
});

app.More = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
    },
    url: function() {
        return '/mooc/lessons/findNoCategory';
    }
});

app.MoreCollection = Backbone.Collection.extend({
    model: app.More
});

app.Details = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
        success: false,
        errors: [],
        errfor: {},
        name: '',
        title: ''
    },
    url: function() {
        return '/mooc/categories/' + app.mainView.model.id;
    },
    parse: function(response) {
        if (response.category) {
            app.mainView.model.set(response.category);
            delete response.category;
        }
        return response;
    }
});

app.Lesson = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
        success: false,
        errors: [],
        errfor: {}
    },
    url: function() {
        return '/mooc/categories/' + app.mainView.model.id + '/lessons';
    },
    parse: function(response) {
        if (response.category) {
            app.mainView.model.set(response.category);
            delete response.category;
        }
        return response;
    }
});

app.LessonCollection = Backbone.Collection.extend({
    model: app.Lesson
});

/**
 * VIEWS
 **/
app.HeaderView = Backbone.View.extend({
    el: '#header-landing',
    template: _.template($('#tmpl-header').html()),
    initialize: function() {
        this.model = app.mainView.model;
        this.listenTo(this.model, 'sync', this.render);
        this.render();
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
    }
});

app.DetailsView = Backbone.View.extend({
    el: '#details',
    template: _.template($('#tmpl-details').html()),
    events: {
        'click .btn-update': 'update'
    },
    initialize: function() {
        this.model = new app.Details();
        this.syncUp();
        this.listenTo(app.mainView.model, 'change', this.syncUp);
        this.listenTo(this.model, 'sync', this.render);
        this.render();
    },
    syncUp: function() {
        this.model.set({
            _id: app.mainView.model.id,
            name: app.mainView.model.get('name'),
            title: app.mainView.model.get('title')
        });
    },
    render: function() {
        //render
        this.$el.html(this.template(this.model.attributes));

        //set input values
        for (var key in this.model.attributes) {
            this.$el.find('[name="' + key + '"]').val(this.model.attributes[key]);
        }
    },
    update: function() {
        this.model.save({
            name: this.$el.find('[name="name"]').val(),
            title: this.$el.find('[name="title"]').val()
        });
    }
});

app.NewLessonView = Backbone.View.extend({
    el: '#lessons-new',
    template: _.template($('#tmpl-lessons-new').html()),
    events: {
        'click .btn-add': 'addNew',
        'keypress input[type="text"]': 'addNewOnEnter'
    },
    initialize: function() {
        this.model = new app.Lesson({_id: app.mainView.model.id});
        this.listenTo(this.model, 'sync', this.render);
        this.render();
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
    },
    validates: function() {
        var errors = [];
        if (this.$el.find('[name="data"]').val() === '') {
            errors.push('Please enter lesson name to add.');
        }

        if (errors.length > 0) {
            this.model.set({errors: errors});
            return false;
        }
        return true;
    },
    addNewOnEnter: function(event) {
        if (event.keyCode != 13) return;
        event.preventDefault();
        this.addNew();
    },
    addNew: function() {
        if (this.validates()) {
            this.addLesson({
                data: this.$el.find('[name="data"]').val()
            });
            this.$el.find('[name="data"]').val('');
        }
    },
    addLesson: function(data) {
        this.model.save(data, {
            success: function(model, response, options) {
                app.moreView.reload();
            }
        });
    }
});

app.LessonCollectionView = Backbone.View.extend({
    el: '#lessons-collection',
    template: _.template($('#tmpl-lessons-collection').html()),
    initialize: function() {
        this.collection = new app.LessonCollection();
        this.syncUp();
        this.listenTo(app.mainView.model, 'change', this.syncUp);

        this.listenTo(this.collection, 'reset', this.render);
        this.render();
        this.setScroll();
    },
    syncUp: function() {
        this.collection.reset(app.mainView.model.get('lessons'));
    },
    render: function() {
        this.$el.html(this.template());

        this.collection.each(function(model) {
            var view = new app.LessonsItemView({model: model});
            $('#lessons-items').append(view.render().$el);
        }, this);

        if (this.collection.length === 0) {
            $('#lessons-items').append($('#tmpl-lessons-none').html());
        }

        this.$el.find('.lesson div .moveup').first().remove();
        this.$el.find('.lesson div .movedown').last().remove();
    },
    setScroll: function() {
        this.$el.css('overflow-y', 'auto');
        this.$el.css('max-height', app.detailsView.$el.height() - app.newLessonView.$el.height());
    }
});

app.LessonsItemView = Backbone.View.extend({
    tagName: 'div',
    className: 'lesson',
    template: _.template($('#tmpl-lessons-item').html()),
    events: {
        'click .btn-delete': 'removeItem',
        'click .moveup': "move",
        'click .movedown': "move"
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));

        return this;
    },
    move: function(ev) {
        var me = this;
        var action = $(ev.currentTarget).hasClass('moveup') ? 'up' : 'down';

        this.model.save({
            success: function(model, response, options) {
                if (response.success) me.renderParent();
            }
        }, {
            url: this.model.url() + '/' + this.model.attributes._id + '/' + action
        });
    },
    removeItem: function() {
        var me = this;

        this.model.destroy({
            url: this.model.url() + '/' + this.model.attributes._id,
            success: function(model, response, options) {
                if (response.success) {
                    me.renderParent();
                    app.moreView.reload();
                }
            }
        });
    },
    renderParent: function() {
        app.lessonsCollectionView.render();
    }
});

app.MoreView = Backbone.View.extend({
    el: '#more',
    template: _.template($('#tmpl-more').html()),
    initialize: function() {
        this.collection = new app.MoreCollection();
        this.listenTo(this.collection, 'reset', this.render);

        this.model = new this.collection.model();
        this.listenTo(this.model, 'sync', this.syncUp);

        this.reload();
    },
    reload: function() {
        this.model.fetch();
    },
    syncUp: function() {
        this.collection.reset(this.model.get('data'));
    },
    render: function() {
        this.$el.html(this.template());

        this.collection.each(function(model) {
            var view = new app.MoreItemView({model: model});
            $('#more-items').append(view.render().$el);
        });

        if (this.collection.length == 0) {
            $('#more-items').append($('#tmpl-more-empty-row').html());
        }
    }
});

app.MoreItemView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#tmpl-more-item').html()),
    events: {
        'click .btn': 'addTo'
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));

        return this;
    },
    addTo: function() {
        app.newLessonView.addLesson({
            data: this.model.attributes.name
        });
    }
});

app.DeleteView = Backbone.View.extend({
    el: '#delete',
    template: _.template($('#tmpl-delete').html()),
    events: {
        'click .btn-delete': 'delete'
    },
    initialize: function() {
        this.model = new app.Delete({_id: app.mainView.model.id});
        this.listenTo(this.model, 'sync', this.render);
        this.render();
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
    },
    delete: function() {
        if (confirm('Are you sure?')) {
            this.model.destroy({
                success: function(model, response, options) {
                    if (response.success) {
                        location.href = '/mooc/categories';
                    } else {
                        app.deleteView.model.set(response);
                    }
                }
            });
        }
    }
});

app.MainView = Backbone.View.extend({
    el: '.page .container',
    initialize: function() {
        app.mainView = this;

        //setup model
        this.model = new app.Category( JSON.parse( unescape($('#data-record').html()) ) );

        //sub views
        app.headerView = new app.HeaderView();
        app.detailsView = new app.DetailsView();
        app.newLessonView = new app.NewLessonView();
        app.lessonsCollectionView = new app.LessonCollectionView();
        app.moreView = new app.MoreView();
        app.deleteView = new app.DeleteView();
    }
});

/**
 * BOOTUP
 **/
$(document).ready(function() {
    app.mainView = new app.MainView();
});
