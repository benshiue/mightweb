var app = app || {};

/**
 * MODELS
 */
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

app.Post = Backbone.Model.extend({
	id: undefined,
	url: function() {
		return '/1/post/' + this.id;
	},
	initialize: function() {
	},
	defaults: {
		success: false,
		errors: [],
		errfor: [],
		post: {
			wchars: 0,
			subject: '',
			content: '',
			html: '',
			userCreated: {
				name: ''
			}
		}
	},
});

app.PostCollection = Backbone.Collection.extend({
	model: app.Post
});

/*
 * VIEWS
 */
app.PostItemView = Backbone.View.extend({
	el: '#content-post-item',
	initialize: function() {
		var self = this;

		this.model = new app.PostItem();
		this.collection = new app.PostCollection();

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

	    $('[data-tag="post-item"]').each(function () {
	        var me = $(this),
	        	id = me.data('id'),
	        	post = new app.Post({id: id});

			post.fetch({
				success: function(model, response, options) {
					//me.find('.status-loading').addClass('hide');
					
				}
			});

			self.collection.push(post);

			// Refactor: use router instead
			//
	        // me.on('click', function() {
	        // 	var id = me.data('id'),
	        // 		post = self.collection.get(id);
	        // 	app.postView.model.set(post.attributes);
	        // });
		});
	}
});

app.PostView = Backbone.View.extend({
	el: '#content-post',
	converter: {},          // markdown parser
	post: {},
	initialize: function() {
		var id = this.$el.data('post-id');

		this.model = new app.Post();	
		this.template = _.template($('#tmpl-post').html());
		this.model.bind('change', this.render, this);

		this.model.set('id', id);
		this.model.fetch({
			success: function(model, response, options) {
			}
		});
	},
	render: function() {
		if (typeof(this.model.get('id')) === 'undefined')
			return;

		this.parse();
		this.$el.html(this.template(this.model.attributes));

		// 分享網址
		$('.fb-share-button').attr('data-href', 'http://www.mokoversity.com/innoboard#' 
				+ app.postItemView.model.tags
				+ "/"
				+ this.model.id);
	},
    parse: function() {
        converter = new Showdown.converter();
        post = this.model.get('post');

        post.html = converter.makeHtml(post.content);
        post.date = moment(post.date).fromNow();

        this.model.set('post', post);
    }
});

/*
 * ROUTES
 */
app.PostRoutes = Backbone.Router.extend({
    routes: {
        ":tag": "pageByTags",
		// http://www.mokoversity.com/innoboard#startup

		":tag/:id": "pageByPost"
		// http://www.mokoversity.com/innoboard#startup/5123857
    },

    tags: '',

    pageByTags: function(tag) {
    	tags = tag;

		app.postItemView = new app.PostItemView();
		app.postView = new app.PostView();
    },

    pageByPost: function(tag, id) {
    	tags = tag;
		
		app.postView = new app.PostView();
		var post = new app.Post({id: id});
		post.fetch({
			success: function(model, response, options) {
				//me.find('.status-loading').addClass('hide');
				app.postView.model.set(post.attributes);
			}
		});
		app.postItemView = new app.PostItemView();
    },

    getTags: function() {
    	return tags;
    }
});

$(document).ready(function () {
	app.postRoutes = new app.PostRoutes();
	Backbone.history.start();
});