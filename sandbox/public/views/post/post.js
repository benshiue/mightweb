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
app.Post = Backbone.Model.extend({
    url: function() {
        return '/1/post'
    },
    defaults: {
        errors: [],
        errfor: {},
        subject: '',
        content: '',
        html: ''
    },
    converter: {},          // markdown parser
    editor: {},             // medium editor
    parse: function() {
        converter = new Showdown.converter({ extensions: ['github', 'table', 'prettify'] });

        var contentblock;
        var htmlblock;

        contentblock = this.get('content');
        contentblock = this._DoCodeBlocks(contentblock);

        htmlblock = converter.makeHtml(contentblock);     // parse to HTML
        this.set('html', htmlblock);

        return true;
    },
    _DoCodeBlocks: function(text) {
        /*
            text = text.replace(text,
                /(?:\n\n|^)
                (                               // $1 = the code block -- one or more lines, starting with a space/tab
                    (?:
                        (?:[ ]{4}|\t)           // Lines must start with a tab or a tab-width of spaces - attacklab: g_tab_width
                        .*\n+
                    )+
                )
                (\n*[ ]{0,3}[^ \t\n]|(?=~0))    // attacklab: g_tab_width
            /g,function(){...});
        */

        // attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
        text += "~0";

        text = text.replace(/(?:^|\n)```(.*)\n([\s\S]*?)\n```/g,
            function(wholeMatch, m1, m2) {
                var codeblock = wholeMatch;

                codeblock = codeblock.replace(/&amp;/g, '&')
                                     .replace(/&lt;/g, '<')
                                     .replace(/&gt;/g, '>')
                                     .replace(/&quot;/g, '"');

                return codeblock;
            }
        );

        // attacklab: strip sentinel
        text = text.replace(/~0/, '');

        return text;
    },
    editable: function() {
        editor = new MediumEditor('.editable', {
            anchorInputPlaceholder: '輸入網址',
            buttons: ['bold', 'italic', 'underline', 'anchor', 'header1', 'header2', 'quote'],
            diffLeft: 0,
            diffTop: -5,
            firstHeader: 'h1',
            secondHeader: 'h2',
            delay: 100,
            targetBlank: true
        });
    },
    serialize: function() {
        var html = editor.serialize().post.value;   // id='post'

        this.set('html', html);
        this.set('content', html2markdown(html));
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
app.PostsView = Backbone.View.extend({
    el: '.wiki-content',
    content: $('[data-tag="markdown"]').html(),
    events: {
        'click .btn-post-save': 'save',
        'click .btn-post-edit': 'edit'
    },
    initialize: function() {
        this.model = new app.Post();
        this.template = _.template($('#tmpl-post').html());

        // initialize Model (not from server)
        var subject = this.$el.find('[data-tag="subject"]').data('post-subject');
        var id = this.$el.find('[data-tag="id"]').data('post-id');

        this.model.set('subject', subject);
        this.model.set('content', this.content);
        this.model.set('id', id);                  // we're NEW

        this.render();
    },
    render: function() {
        this.model.parse();

        var date = this.$el.find('.wiki-date');
        date.html(moment(date.text()).fromNow());

        this.$el.find('#post').html(this.template( this.model.toJSON() ));
    },
    edit: function() {
        this.editable();
        this.$el.find('.btn-post-save').removeClass('hide');
    },
    save: function() {
        //this.$el.find('.btn-post-save').removeClass('btn-warning').addClass('disabled').text('Saving ...');

        this.model.serialize();         // manage changes
        this.model.save();

        $.notify('已儲存成功', { position: 'bottom right', className: 'success' });
    },
    editable: function() {
        this.model.editable();
    },
    /*
     * If we want to use client side content pull, this would works.
     */
    /*
    clientParse: function() {
        $('.wiki-content[data-tag="post"]').each(function () {
            var me = $(this)
                , subject = me.data('post-subject');

              $.ajax({
                url: '/1/post/subject/' + subject,
                type: 'GET',
                dataType: "json",
                success: function (data, textStatus, jqXHR) {
                    if (data.success !== true) return;

                    // parse markdown
                    if (data.post.content.length > 0 ) {
                        var converter = new Showdown.converter();
                        var html = converter.makeHtml(
                            '# ' + decodeURIComponent(data.post.subject)
                            + '\n\n'
                            + data.post.content
                        );
                        $('.wiki-content').html(html);
                    }
                },
                complete: function (data, textStatus, jqXHR) {
                }
              });
        });
    }
    */
});

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

        app.postsView = new app.PostsView();
        app.gravatarView = new app.GravatarView();
    }
});

app.PostItem = Backbone.Model.extend({
    url: function() {
        return '/1/post/tags/' + this.tags;
    },
    currentId: -1,
    tags: '',
    defaults: {
        success: false,
        errors: [],
        errfor: [],

        posts: []
    }
});

app.PostItemView = Backbone.View.extend({
    el: '#content-post-item',
    initialize: function() {
        var self = this;

        this.model = new app.PostItem();

        this.template = _.template($('#tmpl-post-item').html());
        this.model.bind('change', this.render, this);

        this.syncUp();
    },
    syncUp: function(tags) {
        // initialize data model
        var self = this;

        this.model.tags = app.postRoutes.getTags();
        this.model.fetch({
            success: function(model, response, options) {
            }
        });
    },
    render: function() {
        var self = this,
            data = this.template(this.model.attributes);

        this.$el.html(data);

        // 切換標題
        $('[data-tags-switch]').addClass('hide');
        $('[data-tags-switch="' + this.model.tags + '"]').removeClass('hide');
    }
});

/*
 * ROUTES
 */
app.PostRoutes = Backbone.Router.extend({
    routes: {
        ":tag": "pageByTags"
        // http://www.mokoversity.com/post#startup
    },

    tags: '',

    pageByTags: function(tag) {
        tags = tag;

        app.postItemView = new app.PostItemView();
    },

    getTags: function() {
        return tags;
    }
});

/**
 * BOOTUP
 **/

$(document).ready(function() {
    app.mainView = new app.MainView();

    // Router for page listing of 'tag'
    app.postRoutes = new app.PostRoutes();
    Backbone.history.start();

    $('.btn-facebook').hover(function() {
    }, function() {});
});

