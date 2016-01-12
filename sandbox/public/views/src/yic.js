/**
 * Modules
 */
var Elements = require('../../elements/index');
//var ElementSpotIntro = require('../../elements/src/elementSpotIntro');

/**
 * Setup
 */
var app = app || {};

/**
* MODELS
**/
app.SpotIntro = Backbone.Model.extend({
	defaults: {
		success: false,
		errors: [],
		errfor: {},

		title: '',
		href: '',
		img: '',
		intro: ''
	}
});

/**
 *
 */
app.SpotIntroCollection = Backbone.Collection.extend({
    model: app.SpotIntro
});

/**
* VIEWS
**/
app.SpotsView = Backbone.View.extend({
	el: '#spots',
	template: _.template( $('#tmpl-spot-intro').html() ),
	events: {
	},
	initialize: function() {
        this.widget = new Elements.SpotIntro({
          el: this.$el,
          model: app.SpotIntro,
          collection: app.SpotIntroCollection,
          template: this.template
        });
        //this.widgetBig = new Elements.SpotIntro({
        //  el: this.$el,
        //  model: app.SpotIntro,
        //  collection: app.SpotIntroCollection,
        //  template: _.template( $('#tmpl-spot-intro-big').html() )
        //});
		this.render();
	},
	handleClick: function(ev) {
		ev.preventDefault();
		
		var elm = this.$el.find(ev.currentTarget);
		var id = elm.data('id');

		this.widget.composite(id);
	},
	render: function() {
        this.widget.addWidget({
            title: 'Open Culture', 
            img: '//static.mokoversity.com/images/gallery/spot-smarthw.jpg',
            intro: 'Better understanding of free software, open source movement, DIY culture and maker movement.'
        });
        this.widget.addWidget({
            title: 'Data Structure 101', 
            img: '//static.mokoversity.com/images/gallery/spot-smarthw.jpg',
            intro: 'Introducing data structure basics: array, linking-list, tree structure, finite state machine and etc.'
        });
        this.widget.addWidget({
        	title: 'Algorithm 101', 
            img: '//static.mokoversity.com/images/gallery/spot-smarthw.jpg',
        	intro: 'Introducing algorithm basics: sorting, tree-travasal, state transition and etc.'
        });
        this.widget.addWidget({
        	title: 'JavaScript & ES6 101', 
            img: '//static.mokoversity.com/images/gallery/spot-smarthw.jpg',
        	intro: 'Introducing JavaScript: class, function, lambda expression and etc.'
        });
        this.widget.addWidget({
        	title: 'Design Patterns 101', 
            img: '//static.mokoversity.com/images/gallery/spot-smarthw.jpg',
        	intro: 'Introducing creational and structual patterns: singleton, prototype, factory, delegate and etc.'
        });
        this.widget.addWidget({
        	title: 'IoT & REST Object 101', 
            img: '//static.mokoversity.com/images/gallery/spot-smarthw.jpg',
        	intro: 'Introducing physical web: sensor devices, lightweight HTTPD, REST API and etc.'
        });
	}
});

app.SpotActionsView = Backbone.View.extend({
	el: '#spot-actions',
	template: _.template( $('#tmpl-spot-actions').html() ),
	events: {
		'click .btn-start-intro': 'handleClick'
	},
	initialize: function() {
		this.render();
	},
	handleClick: function(ev) {
		ev.preventDefault();

		introJs().start();
	},
	render: function() {
        this.$el.html(this.template( ));
	}
});

/**
* BOOTUP
**/
// Use jQuery ready in browserify mode
// since require() in Node.js is async.
$(function() {
	app.spotsView = new app.SpotsView();
    app.spotActionsView = new app.SpotActionsView();

    // bind waypoint
    $('#crazyfile-point').waypoint({
      handler: function(direction) {
            $('#crazyfile').removeClass('hide')
                           .addClass('animated fadeInDown animation-delay-7');
      },
      offset: '80%'
    }); 
});