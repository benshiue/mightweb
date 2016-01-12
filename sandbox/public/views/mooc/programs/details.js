/**
 * SETUP
 **/
var app = app || {};


/**
 * MODELS
 **/
app.Program = Backbone.Model.extend({
    idAttribute: '_id',
    url: function() {
        return '/mooc/programs/' + this.id;
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
        return '/mooc/programs/' + app.mainView.model.id;
    }
});

app.Details = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
        success: false,
        errors: [],
        errfor: {},
        lecture: '',
        title: '',
        type: 'video',
        duration: 0,
        markdown: '',
        mentors: [],
        author: '',
        creator: '',
        isActive: false
    },
    url: function() {
        return '/mooc/programs/' + app.mainView.model.id;
    },
    parse: function(response) {
        if (response.admin) {
            app.mainView.model.set(response.admin);
            delete response.admin;
        }
        return response;
    }
});

app.Relations = Backbone.Model.extend({
    idAttribute: '_id',
    removeId: null,
    defaults: {
        success: false,
        errors: [],
        errfor: {},
        lesson: {}
    },
    url: function() {
        return '/mooc/programs/' + app.mainView.model.id;
    },
    parse: function(response) {
        if (response.program) {
            app.mainView.model.set(response.program);
            delete response.program;
        }
        return response;
    }
});


/**
 * VIEWS
 **/
app.HeaderView = Backbone.View.extend({
    el: '#header-landing',
    template: _.template($('#tmpl-header').html()),
    initialize: function() {
        this.model = app.mainView.model;
        this.model.on('change', this.render, this);
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
        'click .btn-update': 'updateType',
        'click .isActive': 'updateIsActive',
        'click .icon-refresh': 'getDuration',
        'click .btn-save': 'update'
    },
    initialize: function() {
        this.model = new app.Details();
        this.syncUp();
        this.listenTo(app.mainView.model, 'change', this.syncUp);

        this.model.on('change', this.render, this);
        this.render();
    },
    syncUp: function() {
        this.model.set({
            _id: app.mainView.model.id,
            lecture: app.mainView.model.get('lecture'),
            title: app.mainView.model.get('title'),
            type: app.mainView.model.get('type'),
            duration: app.mainView.model.get('duration'),
            creator: app.mainView.model.get('userCreated').name,
            isActive: app.mainView.model.get('isActive'),
            author: app.mainView.model.get('author'),
        });
    },
    render: function() {
        //render
        this.model.attributes.mentors = JSON.parse($('#data-mentors').html());
        this.$el.html(this.template(this.model.attributes));

        //set input values
        for (var key in this.model.attributes) {
            this.$el.find('[name="' + key + '"]').val(this.model.attributes[key]);
        }

        // active program type
        $('.type button[data-type]').removeClass('active');
        $('.type button[data-type="' + this.model.attributes.type + '"]').addClass('active').addClass('btn-info');

        $('.isActive').bootstrapSwitch();

        $('select[name="author"]').selectpicker({
            style: 'btn-primary',
            menuStyle: 'dropdown-inverse'
        });

        $('select[name="author"]').selectpicker('val', this.model.attributes.author);

    },
    updateType: function(e) {
        var me = $(e.target);

        this.$el.find('.btn-update').removeClass('active');
        me.addClass('active');

        this.update();
    },
    updateIsActive: function(e) {
        this.update();
    },
    update: function() {
        this.$el.find('.btn-save').addClass('hide');
        this.$el.find('.btn-progress').removeClass('hide');

        this.model.save({
            lecture: this.$el.find('[name="lecture"]').val(),
            title: this.$el.find('[name="title"]').val(),
            type: this.$el.find('.type .active').data('type'),
            duration: this.$el.find('[name="duration"]').val(),
            isActive: this.$el.find('.isActive').bootstrapSwitch('status'),
            author: $('select[name="author"]').selectpicker('val')
        });
    },
    getDuration: function() {
        var me = this;

        $.get('/mooc/programs/meta/' + this.model.attributes._id, function(resp) {
            if (resp.success) {
                me.model.set(resp.program);
                me.render();
            } else {
                console.log(resp.errors);
            }
        });
    }
});

app.RelationsView = Backbone.View.extend({
    el: '#relations',
    template: _.template($('#tmpl-relations').html()),
    events: {
        'click .btn-lesson-open': 'lessonOpen',
        'click .btn-lesson-link': 'lessonLink',
        'click .btn-lesson-unlink': 'lessonUnlink'
    },
    initialize: function() {
        this.model = new app.Relations();
        this.syncUp();
        this.listenTo(app.mainView.model, 'change', this.syncUp);

        this.model.on('change', this.render, this);
        this.render();
    },
    syncUp: function() {
        this.model.set({
            _id: app.mainView.model.id,
            lesson: app.mainView.model.get('lesson')
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
    lessonOpen: function() {
        location.href = '/mooc/lessons/' + this.model.get('lesson')._id;
    },
    lessonLink: function() {
        this.model.save({
            newLessonName: $('[name="newLessonName"]').val()
        },{
            url: this.model.url() + 'relation-lesson'
        });
    },
    lessonUnlink: function() {
        if (confirm('Are you sure?')) {
            this.model.destroy({
                url: this.model.url() + 'relation-lesson',
                success: function(model, response, options) {
                    if (response.program) {
                        app.mainView.model.set(response.program);
                        delete response.program;
                    }
                    app.relationsView.model.set(response);
                }
            });
        }
    }
});

app.DeleteView = Backbone.View.extend({
    el: '#delete',
    template: _.template($('#tmpl-delete').html()),
    events: {
        'click .btn-delete': 'delete',
    },
    initialize: function() {
        this.model = new app.Delete({_id: app.mainView.model.id});
        this.model.on('change', this.render, this);
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
                        location.href = '/mooc/programs';
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
        this.model = new app.Program(JSON.parse($('#data-record').html()));

        //sub views
        app.headerView = new app.HeaderView();
        app.detailsView = new app.DetailsView();
        //app.relationsView = new app.RelationsView();
        app.deleteView = new app.DeleteView();
    }
});

/**
 * BOOTUP
 **/
$(document).ready(function() {
    app.mainView = new app.MainView();
});
