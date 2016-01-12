/**
Copyright (C) 2013 Moko365 Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * SETUP
 **/
var app = app || {};


/**
 * MODELS
 **/
app.Course = Backbone.Model.extend({
    url: '/course',
    defaults: {
        errors: [],
        errfor: {},
        isviewed: false
    }
});

app.Lesson = Backbone.Model.extend({
    url: '/course',
    defaults: {
        errors: [],
        errfor: {},
        lesson: {
            sessions: 0,
            followers: 0
        }
    }
});

app.Wiki = Backbone.Model.extend({
    url: '/api/program/wiki',
    defaults: {
        errors: [],
        errfor: {},
        html: ''
    }
});

app.Gravatar = Backbone.Model.extend({
    // http://en.gravatar.com/400c529007e2242ac7132c78fc772e91.json
    url: function() {
        return 'http://www.gravatar.com/' + this.emailHash + '.json';
    },
    emailHash: '',
    defaults: {
        errors: [],
        errfor: {},

        entry: []
    },
});

/**
 * VIEWS
 **/
app.CourseView = Backbone.View.extend({
    events: {
    },
    initialize: function() {
        this.model = new app.Course();
        this.composite();
    },
    render: function() {
    },
    composite: function() {
        if ($('#user').data('username')) {
            this.validateViewTags();
        }
        this.toggleTagMoreInfo();
        this.renderDuration();
    },
    validateViewTags: function() {
        $("[data-tag-view='lecture']").each(function() {
            var me = $(this);
            var lecture = me.data('lecture-name');

            $.ajax({
                type: 'GET',
                url: '/api/program/isviewed',
                data: 'lecture=' + lecture,
                cache: false,
                success: function(response) {
                    if (response.success === true
                         && response.isviewed === true) {
                        me.removeClass('hide');
                    }
                },
            });
        });
    },
    toggleTagMoreInfo: function() {
        $("button[data-tag='more-info']").each(function() {
            var me = $(this);
            me.click(function() {
                var value = me.data('value');
                var info = $('#' + value);

                me.addClass('hide');
                info.removeClass('hide');
            });
        });
    },
    renderDuration: function() {
        $('.timeduration').each(function(key, value) {
            var duration = parseInt(value.innerText, 10);
            if (duration) value.innerText = moment(duration * 1000).format('mm:ss');
        });
    }
});

app.LessonView = Backbone.View.extend({
    events: {
    },
    initialize: function() {
        this.model = new app.Lesson();
        this.composite();
    },
    render: function() {
    },
    composite: function() {
        this.validateViewTags();

        if ($('#user').data('username')) {
            this.validateProgressBar();
        }
    },
    validateViewTags: function() {
        $("[data-tag='lesson-sessions']").each(function() {
            var me = $(this);
            var name = me.data('lesson-name');

            $.ajax({
                type: 'GET',
                url: '/api/lesson/info',
                data: 'name=' + name,
                success: function(response) {
                    if (response.success === true) {
                        me.html(response.lesson.sessions);
                    }
                },
            });
        });
    },
    validateProgressBar: function() {
        $("[data-tag='lesson-progress']").each(function() {
            var me = $(this);
            var name = me.data('lesson-name');
            var progress = 0;
            var s = '';

            $.ajax({
                type: 'GET',
                url: '/api/lesson/progress',
                data: 'name=' + name,
                cache: false,
                success: function(response) {
                    if (response.success === true) {
                        if (response.sessions !== 0)
                            progress = response.views / response.sessions * 100;
                        s = parseInt(progress).toString() + '%';

                        me.html(s);
                        $("[data-progressbar-for='" + name + "']").css('width', s)
                    }
                },
            });
        });
    }
});


app.WikiView = Backbone.View.extend({
    el: '.wiki-content',
    initialize: function() {
        if (this.$el.length) {

            var data = {};
            var lectureName = this.$el.data('lecture-name');
            var lessonName = this.$el.data('lesson-name');

            if (lectureName) data.lecture = lectureName;
            if (lessonName) data.lesson = lessonName;

            var me = this;
            this.model = new app.Wiki();
            this.model.fetch({data: data,
                success: function(model, response, options) {
                    if (response.success) {
                        me.$el.html(response.html);
                    }
                }
            });
        }
    }
});

// app.EditableView = Backbone.View.extend({
//     initialize: function() {
//         this.launchEditor();
//     },
//     render: function() {
//     },
//     launchEditor: function() {
//         jQuery('body').midgardCreate({
//             url: function() {
//                 return '/admin/programs' + (this.isNew() ? '' : '/' + this.id);
//             },
//             display: 'minimized',
//         });

//         // Set a simpler editor for title fields
//         jQuery('body').midgardCreate('configureEditor', 'editor', 'halloWidget', {
//             plugins: {
//                 halloformat: {},
//                 halloblacklist: {
//                     tags: ['br']
//                 }
//             }
//         });

//         jQuery('body').midgardCreate('setEditorForProperty', 'dcterms:title', 'editor');

//         // Disable editing of fields
//         jQuery('body').midgardCreate('setEditorForProperty', 'dcterms:duration', null);
//         jQuery('body').midgardCreate('setEditorForProperty', 'dcterms:lecture', null);
//     }
// });

// app.Result = Backbone.Model.extend({

// });

// app.ResultCollection = Backbone.Collection.extend({
//     model: app.Result
// });

// app.ResultView = Backbone.View.extend({
//     el: '#results',
//     template: _.template($('#tmpl-results').html()),
//     initialize: function() {
//         this.collection = new app.ResultCollection();
//         this.collection.reset(app.mainView.model.get('lessons'));

//         this.render();
//     },
//     render: function() {
//         this.$el.html(this.template());

//         this.collection.each(function(model) {
//             var view = new app.ResultItemView({model: model});
//             $('#lesson-items').append(view.render().$el);
//         });

//     }
// });

// app.ResultItemView = Backbone.View.extend({
//     tagName: 'div',
//     className: 'row lesson-item',
//     template: _.template($('#tmpl-result-item').html()),
//     render: function() {
//         this.$el.html(this.template(this.model.attributes));

//         return this;
//     }
// });

app.GravatarView = Backbone.View.extend({
    el: '#gravatar',
    events: {
    },
    initialize: function() {
        this.model = new app.Gravatar();
        this.template = _.template($('#tmpl-gravatar').html());

        //this.listenTo(this.model, 'sync', this.render);
        //this.listenTo(this.model, 'change', this.render);

        this.syncUp();
    },
    syncUp: function() {
        var emailHash;
        var self;

        emailHash = this.$el.data('email-hash');
        this.model.emailHash = emailHash;

        self = this;

        this.model.fetch({
            // backbone supports CORS
            // see: http://stackoverflow.com/questions/16041172/backbone-js-wont-make-cross-host-requests
            dataType: 'jsonp',
            success: function(model, response, options) {
                self.render();
            },
            error: function(model, response, options) {

            }
        });
    },
    render: function() {
        this.$el.html(this.template( this.model.toJSON() ));

        $('#use-gravatar').removeClass('hide');
        $('#use-local').addClass('hide');
    }
});

app.MainView = Backbone.View.extend({
    initialize: function() {
        app.mainView = this;

        //setup model
        // this.model = new app.Result(JSON.parse($('#data-results').html()));

        app.courseView = new app.CourseView();
        app.lessonView = new app.LessonView();
        // app.wikiView = new app.WikiView();
        // app.ResultView = new app.ResultView();
        // app.editableView = new app.EditableView();
        // app.gravatarView = new app.GravatarView();


        if ($('#markdown').length > 0 ) {
            var converter = new Showdown.converter();
            var markdown = $('#markdown').html();
            var html = converter.makeHtml(markdown);
            $('.wiki-content').html(html);
        }
    }
});
/**
 * BOOTUP
 **/
$(document).ready(function() {
    app.mainView = new app.MainView();
    $("[data-toggle='switch']").wrap('<div class="switch" />').parent().bootstrapSwitch();
});

