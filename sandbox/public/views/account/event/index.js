/**
 * SETUP
 **/
var app = app || {};



/**
 * MODELS
 **/
app.Event = Backbone.Model.extend({
  url: function() {
    return '/1/pass';
  },
  defaults: {
    success: false,
    errors: [],
    errfor: {}
  }
});



/**
 * VIEWS
 **/
app.EventView = Backbone.View.extend({
  el: '#event-form',
  template: _.template( $('#tmpl-event-form').html() ),
  events: {
      'submit form': 'preventSubmit',
      'click .btn-ticket': 'ticket'
  },
  initialize: function() {
      this.model = new app.Event();

      this.listenTo(this.model, 'sync', this.render);
      this.render();
  },
  render: function() {
      this.$el.html(this.template( this.model.attributes ));
  },
  preventSubmit: function(event) {
      event.preventDefault();
  },
  ticket: function() {
      var ticketInfo = $(this).data('ticket-info');

      alert(ticketInfo);
  }
});

app.TicketView = Backbone.View.extend({
  el: '#ticket',
  events: {
      'click .btn-ticket': 'ticket'
  },
  initialize: function() {
    alert('ok');
  },
  render: function() {
  },
  ticket: function() {
      var ticketInfo = $(this).data('ticket-info');

      alert(ticketInfo);
  }
});

/**
 * BOOTUP
 **/
$(document).ready(function() {
  app.eventView = new app.EventView();
  app.ticketView = new app.TicketView();
});
