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
        	title: 'IoT OS', 
        	href: '/coders',
        	img: '//static.mokoversity.com/images/gallery/spot-course.jpg',
        	intro: '介紹 IoT 作業系統。將率先使用 ARM mbed，並以實際開發板進行實作討論。'
        });
        this.widget.addWidget({
        	title: '感測裝置', 
        	href: '/coders',
        	img: '//static.mokoversity.com/images/gallery/spot-rest.jpg',
        	intro: '討論 ARM mbed + sensor hardware，並與 Startup 共同設計、定義與共享演算法。'
        });
        this.widget.addWidget({
        	title: '智能硬件', 
        	href: '/camp/full-stack',
        	img: '//static.mokoversity.com/images/gallery/spot-online.jpg',
        	intro: '設計並實作 REST device，並且打造 full stack 的 ARM mbed 作業系統。'
        });
        this.widget.addWidget({
        	title: 'In-Place Analytics', 
        	href: '/camp/full-stack',
        	img: '//static.mokoversity.com/images/gallery/spot-mbed.jpg',
        	intro: '研究本地即時數據分析的原理，並進行實作討論。'
        });
        this.widget.addWidget({
        	title: 'Small Data', 
        	href: '/camp/full-stack',
        	img: '//static.mokoversity.com/images/gallery/spot-smarthw.jpg',
        	intro: 'Real-time small data 的資料結構、模式與實作。'
        });
        this.widget.addWidget({
        	title: 'IoT Framework', 
        	href: '/camp/full-stack',
        	img: '//static.mokoversity.com/images/gallery/spot-smarthw.jpg',
        	intro: '共同設計並定義未來的 IoT 裝置框架。'
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
});