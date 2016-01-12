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


/**
 * VIEWS
 **/
app.PostItem = Backbone.Model.extend({
    url: function() {
        return '/1/post/tags/' + this.tags + '?limit=3';
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
    }
});

/*
 * ROUTES
 */
app.PostRoutes = Backbone.Router.extend({
    routes: {
    	"": "default",
        ":tag": "pageByTags"
        // http://www.mokoversity.com/#startup
    },

    tags: '',

    default: function() {
        tags = 'fullstack';		// default tag

        app.postItemView = new app.PostItemView();
    },

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
    app.postRoutes = new app.PostRoutes();
    Backbone.history.start();

    // See: https://github.com/MokoVersity/mokoversity-frontend/issues/81
    $('#vision-section').waypoint(function(direction) {
         // Deferred loading images
        $(".img-caption").each(function() {
            var me = $(this),
                imageBlock = me.find('img'),
                src = imageBlock.attr('src');

                if (src === '')
                    imageBlock.attr('src', imageBlock.data('image-src'));
        });
    });

    $('#vision-section').waypoint(function(direction) {
         // Deferred loading images
        $("#course-section .thumbnail").each(function() {
            var me = $(this),
                imageBlock = me.find('img'),
                src = imageBlock.attr('src');

                if (src === '')
                    imageBlock.attr('src', imageBlock.data('image-src'));
        });
    });

    $('#news-section').waypoint(function(direction) {
         // Deferred loading images
        $("#highlight-section .hightlight").each(function() {
            var me = $(this),
                imageBlock = me.find('img'),
                src = imageBlock.attr('src');

                if (src === '')
                    imageBlock.attr('src', imageBlock.data('image-src'));
        });
    });
});



/**
 * Outside of Backbone.js
 **/
//(function() {
//  $('#main-menu').addClass('hide');
//
//  $('.cover-story-9').waypoint(function(direction) {
//    $('#main-menu').removeClass('hide');
//    $("#main-menu").css('background', 'rgba(0, 0, 0, 0.75)');
//  });
//})();