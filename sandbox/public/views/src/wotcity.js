/**
 * Modules
 */
 /**
 * Modules
 */
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Automation = require('automationjs');

/**
 * Setup
 */
Backbone.$ = $;
var app = app || {};

/**
* MODELS
**/
app.Container = Backbone.Model.extend({
	url: function() {
		return '/' 
	},
	wsUrl: function() {
		return 'ws://wot.city/object/' + this.attributes.name + '/viewer' 
	},
	defaults: {
		name: 'test',
		data: '',
		cid: 0
	},
	// AutomationJS plugins
	parseJSON: function() {
		// remove internal properties from model
		var objCopy = function(object) {
		    var o = {};
		    for (var p in object) {
		    	// don't copy internal reference properties
		    	if (p === 'name' || p === 'data' || p === 'cid')
		    		continue;

		        if (object.hasOwnProperty(p)) {
		        	o[p] = object[p];
		        }
		    }
		    return o;
		};

		var o = objCopy(this.attributes);

		this.set('data', JSON.stringify(o));
	}
});

/**
* VIEWS
**/
app.ContainerView = Backbone.View.extend({
	el: '#demo-container',
	template: _.template( $('#tmpl-container').html() ),
	initialize: function() {
        this.component = new Automation({
          el: this.$el,
          model: app.Container,
          template: this.template
        });
	}
});

app.ControlView = Backbone.View.extend({
	el: '#demo-control',
	events: {
		'click .btn-object-submit': 'handleTaget',
	},
	handleTaget: function(ev) {
		ev.preventDefault();

		var name = $('.object-name').val();
		
        app.containerView.component.add({
        	name: name
        });	
	}
});

/**
* BOOTUP
**/
// Use jQuery ready in browserify mode
// since require() in Node.js is async.
$(function() {
	app.containerView = new app.ContainerView();
	app.controlView = new app.ControlView();
});