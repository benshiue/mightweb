/**
 * SETUP
 **/
  var app = app || {};



/**
 * MODELS
 **/
  app.PostCreate = Backbone.Model.extend({
    idAttribute: '_id',
    url: function() {
      return '/1/post';
    },
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      post: {},
    }
  });



/**
 * VIEWS
 **/
  app.PostCreateView = Backbone.View.extend({
    el: '#post',
    template: _.template( $('#tmpl-post').html() ),
    events: {
        'submit form': 'preventSubmit',
        'click .btn-post-save': 'save'
    },
    initialize: function() {
      this.model = new app.PostCreate();
      this.listenTo(this.model, 'sync', this.render);
      this.listenTo(this.model, 'change', this.render);
      this.render();
      this.fetchData();
    },
    render: function() {
      this.$el.html(this.template( this.model.toJSON() ));

      //set input values
      var post = this.model.get('post');

      this.$el.find('[name="content"]').val(post.content);
      this.$el.find('[name="tags"]').val(post.tags);

      $(".tagsinput").tagsInput();
    },
    preventSubmit: function(event) {
      event.preventDefault();
    },
    fetchData: function() {
      var id = this.$el.find('[name="id"]').val()
        , self = this;

      if (id !== '') {
	      $.ajax({
	        url: '/1/post/' + id,
	        type: 'GET',
	        dataType: "json",
	        success: function (data, textStatus, jqXHR) {
	        	if (data.success !== true) return;
            self.model.set('post', data.post);
	        },
	        complete: function (data, textStatus, jqXHR) {
		        $.notify('正在修改一篇文章', { position: 'bottom right', className: 'info' });
	        }
	      });
      }
    },
    /* TODO: */
    syncUp: function() {
      var id = this.$el.find('[name="id"]').val()
        , self = this;

      if (id !== '') {
        this.model.set('_id', id);
        this.model.fetch({
          success: function(model, response, options) {
            self.model.set('post', response.post);
            $.notify('正在修改一篇文章', { position: 'bottom right', className: 'info' });
          }
        });
      }
    },
    save: function() {
        this.$el.find('.btn-post-save').removeClass('btn-warning').addClass('disabled').text('Saving ...');

        // always not new
        var id = this.$el.find('[name="id"]').val()
          , content = this.$el.find('[name="content"]').val()
          , tags = this.$el.find('[name="tags"]').val();

        if (id !== '') { // PUT (update)
          this.model.save({
              id: id,
              subject: this.model.get('subject'),
              content: content,
              tags: tags
          });
        } else { // POST (create)
          this.model.save({
              subject: this.$el.find('[name="subject"]').val(),
              content: content,
              tags: tags
          });
        }
    }
  });

/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.PostCreateView = new app.PostCreateView();
  });
