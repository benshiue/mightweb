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
 * VIEWS
 **/
app.PostsView = Backbone.View.extend({
    el: '#post',
    content: $('[data-tag="markdown"]').html(),
    events: {
    },
    initialize: function() {
        this.template = _.template($('#tmpl-post').html());

        this.render();
    },
    render: function() {
        //var date = this.$el.find('.wiki-date');
        //date.html(moment(date.text()).fromNow());

        this.parse();
    },
    // Deferred loading images
    syncUp: function() {
      this.$el.find('img[data-src]').each(function() {
        $(this).waypoint({
          element: this,
          handler: function(direction) {
            var me = $(this)
            ,   src = me.attr('src');

            if (typeof(src) === 'undefined') {
              me.attr('src', me.data('src'));

              // for Fancybox
              $(this).addClass('onHover');
            }
          },
          offset: '90%'
        });        
      });

      // bind Fancybox
      this.$el.find('img[data-src]').fancybox({
        'transitionIn'  : 'elastic',
        'transitionOut' : 'elastic',
        'speedIn'     : 2600, 
        'speedOut'    : 200, 
        'overlayShow' : false,
        'hideOnContentClick': true,
        beforeShow: function () {
          $(".fancybox-wrap img").addClass('onFancyBox');
        },
        fitToView: true,
      });
    },
    parse: function() {
        converter = new Showdown.converter({ extensions: ['table', 'github', 'prettify'] });

        var contentblock;
        var htmlblock;

        // preprocessor
        contentblock = this.content;
        contentblock = this._DoCodeBlocks(contentblock);
        // deferred image loading
        contentblock = this._DoImages(contentblock);

        // start parsing markdown code
        htmlblock = converter.makeHtml(contentblock);     // parse to HTML

        this.$el.html(htmlblock);

        this.syncUp();

        return true;
    },
    _DoCodeBlocks: function(text) {
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
    _DoImages: function(text) {
        text = text.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g, this.writeImageTag);
        text = text.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g, this.writeImageTag);

        return text;
    },
    writeImageTag: function(wholeMatch,m1,m2,m3,m4,m5,m6,m7) {
        var whole_match = m1;
        var alt_text   = m2;
        var link_id  = m3.toLowerCase();
        var url     = m4;
        var title   = m7;

        var escapeCharacters_callback = function(wholeMatch,m1) {
            var charCodeToEscape = m1.charCodeAt(0);
            return "~E"+charCodeToEscape+"E";
        };

        var escapeCharacters = function(text, charsToEscape, afterBackslash) {
            // First we have to escape the escape characters so that
            // we can build a character class out of them
            var regexString = "([" + charsToEscape.replace(/([\[\]\\])/g,"\\$1") + "])";

            if (afterBackslash) {
                regexString = "\\\\" + regexString;
            }

            var regex = new RegExp(regexString,"g");
            text = text.replace(regex,escapeCharacters_callback);

            return text;
        };

        if (!title) title = "";

        if (url == "") {
            if (link_id == "") {
                // lower-case and turn embedded newlines into spaces
                link_id = alt_text.toLowerCase().replace(/ ?\n/g," ");
            }
            url = "#"+link_id;

            if (g_urls[link_id] != undefined) {
                url = g_urls[link_id];
                if (g_titles[link_id] != undefined) {
                    title = g_titles[link_id];
                }
            }
            else {
                return whole_match;
            }
        }

        alt_text = alt_text.replace(/"/g,"&quot;");
        //url = escapeCharacters(url,"*_");
        var result = "<img data-src=\"" + url + "\" alt=\"" + alt_text + "\"";

        // attacklab: Markdown.pl adds empty title attributes to images.
        // Replicate this bug.

        //if (title != "") {
            title = title.replace(/"/g,"&quot;");
            title = escapeCharacters(title,"*_");
            result +=  " title=\"" + title + "\"";
        //}

        result += " />";

        return result;
    }
});


app.MainView = Backbone.View.extend({
    initialize: function() {
        app.mainView = this;

        app.postsView = new app.PostsView();
    }
});


/**
 * BOOTUP
 **/

$(document).ready(function() {
    app.mainView = new app.MainView();
});