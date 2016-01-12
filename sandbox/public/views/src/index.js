/**
 * Modules
 */
var Elements = require('../../elements/index');
//var ElementSpotNews = require('../../elements/src/elementSpotNews');

/**
 * Setup
 */
var app = app || {};

/**
* MODELS
**/
app.SpotNews = Backbone.Model.extend({
	defaults: {
		success: false,
		errors: [],
		errfor: {},

		title: '',
		href: '',
		img: ''
	}
});

/**
 *
 */
app.SpotNewsCollection = Backbone.Collection.extend({
    model: app.SpotNews
});

/**
* VIEWS
**/
app.SpotsView = Backbone.View.extend({
	el: '#spots',
	template: _.template( $('#tmpl-spot-news').html() ),
	events: {
		//'click .btn-spot-news': 'handleClick'
	},
	initialize: function() {
		//this.model = new app.SpotNews();
        this.widget = new Elements.SpotNews({
          el: this.$el,
          model: app.SpotNews,
          collection: app.SpotNewsCollection,
          template: this.template
        });
		this.render();
	},
	handleClick: function(ev) {
		ev.preventDefault();
		
		var elm = this.$el.find(ev.currentTarget);
		var id = elm.data('id');

		this.widget.composite(id);
	},
	// Facade pattern
	render: function() {
        this.widget.addWidget({
        	title: '全民寫程式運動', 
        	href: '/coders',
        	img: '//static.mokoversity.com/images/gallery/spot-course.jpg'
        });
        //this.widget.addWidget({
        //	title: '線上入門課程', 
        //	href: '/course/html5',
        //	img: '//static.mokoversity.com/images/gallery/spot-online.jpg'
        //});
        this.widget.addWidget({
        	title: 'Young Innovator Camp', 
        	href: '/yic',
        	img: '/images/gallery/spot-camp.jpg'
        });
        this.widget.addWidget({
        	title: 'Web App 專業訓練', 
        	href: '/camp/full-stack',
        	img: '//static.mokoversity.com/images/gallery/spot-training.jpg'
        });
	}
});

app.WorkshopView = Backbone.View.extend({
	el: '#workshop',
	template: _.template( $('#tmpl-spot-workshop').html() ),
	events: {
		//'click .btn-spot-news': 'handleClick'
	},
	initialize: function() {
		//this.model = new app.SpotNews();
        this.widget = new Elements.SpotNews({
          el: this.$el,
          model: app.SpotNews,
          collection: app.SpotNewsCollection,
          template: this.template
        });
		this.render();
	},
	handleClick: function(ev) {
		ev.preventDefault();
		
		var elm = this.$el.find(ev.currentTarget);
		var id = elm.data('id');

		this.widget.composite(id);
	},
	// Facade pattern
	render: function() {
        this.widget.addWidget({
        	title: 'Internet of Things', 
        	href: '/makers',
        	img: 'http://placehold.it/640x480.jpg/669966/&text=Internet+of+Things'
        });
	}
});

/**
* BOOTUP
**/
// Use jQuery ready in browserify mode
// since require() in Node.js is async.
$(function() {
	app.spotsView = new app.SpotsView();
	//app.workshopView = new app.WorkshopView();

    $('#iot-projects').waypoint(function(direction) {
        // deferred load facebook like plugins
        var h3 = $('.training-landing #intro h3'),
            p = $('.training-landing #intro p');

    	var gradient = ['#eee', '#ddd', '#ccc', '#bbb', '#aaa'
    			, '#999', '#888', '#777', '#666', '#555', '#444'
    			, '#333', '#222'];

        var transition = function(target, g, to) {
        	if (to >= g.length)
        			return;

            target
            	.css('color', g[to])
            	.css('-webkit-transition', 'color 0.2s')
            	.css('transition', 'color 0.2s');

        	setTimeout(function() {
        		to++;
        		transition(target, g, to);
        	}.bind(this), 250);
        };

        if (direction === 'down') {
        	transition(h3, gradient, 0);
        	transition(p, gradient, 0);
        } else {
            h3.css('color', '#fff');
            p.css('color', '#fff');       	
        }
    });
});