/* global app:true */

(function() {
    'use strict';

    var app = app || {};

    app.Account = Backbone.Model.extend({
        idAttribute: '_id',
        url: '/account/settings'
    });

    app.User = Backbone.Model.extend({
        idAttribute: '_id',
        url: '/account/settings'
    });

    app.Details = Backbone.Model.extend({
        idAttribute: '_id',
        defaults: {
            success: false,
            errors: [],
            errfor: {},
            full: '',
            company: '',
            phone: '',
            zip: ''
        },
        url: '/account/settings',
        parse: function(response) {
            if (response.account) {
                app.mainView.account.set(response.account);
                delete response.account;
            }
            return response;
        }
    });

    app.Identity = Backbone.Model.extend({
        idAttribute: '_id',
        defaults: {
            success: false,
            errors: [],
            errfor: {},
            // username: '',
            email: ''
        },
        url: '/account/settings/identity',
        parse: function(response) {
            if (response.user) {
                app.mainView.user.set(response.user);
                delete response.user;
            }
            return response;
        }
    });

    app.Password = Backbone.Model.extend({
        idAttribute: '_id',
        defaults: {
            success: false,
            errors: [],
            errfor: {},
            newPassword: '',
            confirm: ''
        },
        url: '/account/settings/password',
        parse: function(response) {
            if (response.user) {
                app.mainView.user.set(response.user);
                delete response.user;
            }
            return response;
        }
    });

    app.DetailsView = Backbone.View.extend({
        el: '#details',
        template: _.template( $('#tmpl-details').html() ),
        events: {
            'click .btn-update': 'update'
        },
        initialize: function() {
            this.model = new app.Details();
            this.syncUp();
            this.listenTo(app.mainView.account, 'change', this.syncUp);
            this.listenTo(this.model, 'sync', this.render);
            this.render();
        },
        syncUp: function() {
            this.model.set({
                _id: app.mainView.account.id,
                full: app.mainView.account.get('name').full,
                company: app.mainView.account.get('company'),
                phone: app.mainView.account.get('phone'),
                zip: app.mainView.account.get('zip')
            });
        },
        render: function() {
            //render
            this.$el.html(this.template(this.model.attributes));

            //set input values
            for (var key in this.model.attributes) {
                this.$el.find('[name="' + key + '"]').val(this.model.attributes[key]);
            }
        },
        update: function() {
            this.model.save({
                full: this.$el.find('[name="full"]').val(),
                company: this.$el.find('[name="company"]').val(),
                phone: this.$el.find('[name="phone"]').val(),
                zip: this.$el.find('[name="zip"]').val()
            });
        }
    });

    app.IdentityView = Backbone.View.extend({
        el: '#identity',
        template: _.template($('#tmpl-identity').html()),
        events: {
            'click .btn-update': 'update'
        },
        initialize: function() {
            this.model = new app.Identity();
            this.syncUp();
            this.listenTo(app.mainView.user, 'change', this.syncUp);
            this.listenTo(this.model, 'sync', this.render);
            this.render();
        },
        syncUp: function() {
            this.model.set({
                _id: app.mainView.user.id,
                // username: app.mainView.user.get('username'),
                email: app.mainView.user.get('email')
            });
        },
        render: function() {
            //render
            this.$el.html(this.template(this.model.attributes));

            //set input values
            for (var key in this.model.attributes) {
                this.$el.find('[name="' + key + '"]').val(this.model.attributes[key]);
            }
        },
        update: function() {
            this.model.save({
                // username: this.$el.find('[name="username"]').val(),
                email: this.$el.find('[name="email"]').val()
            });
        }
    });

    app.PasswordView = Backbone.View.extend({
        el: '#password',
        template: _.template($('#tmpl-password').html()),
        events: {
            'click .btn-password': 'password'
        },
        initialize: function() {
            this.model = new app.Password({_id: app.mainView.user.id});
            this.listenTo(this.model, 'sync', this.render);
            this.render();
        },
        render: function() {
            //render
            this.$el.html(this.template(this.model.attributes));

            //set input values
            for (var key in this.model.attributes) {
                this.$el.find('[name="' + key + '"]').val(this.model.attributes[key]);
            }
        },
        password: function() {
            this.model.save({
                newPassword: this.$el.find('[name="newPassword"]').val(),
                confirm: this.$el.find('[name="confirm"]').val()
            });
        }
    });

    app.MainView = Backbone.View.extend({
        el: '.page .container',
        initialize: function() {
            app.mainView = this;

            //setup model
            this.account = new app.Account( JSON.parse( unescape($('#data-account').html()) ) );
            this.user = new app.User( JSON.parse( unescape($('#data-user').html())) );

            //sub views
            app.detailsView = new app.DetailsView();
            app.identityView = new app.IdentityView();
            app.passwordView = new app.PasswordView();
        }
    });

    $(document).ready(function() {
        app.mainView = new app.MainView();
    });
}());
