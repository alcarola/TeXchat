define([
  'jquery',
  'underscore',
  'backbone',
  'texchat',
  'util/util',

  'libs/bootstrap/bootstrap-twipsy',
  'libs/bootstrap/bootstrap-popover',
  ], function($, _, Backbone, TeXchat, Util) {

// View

var ChatView = Backbone.View.extend({

  tagName: 'div',
  className: 'chat',

  events: {
  },

  render: function() {

    this.clear();
  },

  clear: function() {
    $(this.el).empty();
  },

  appendMessage: function(message) {
    if (message) {

      // render the message
      var elMsg = $(this.msgTemplate(message));

      // ensure this elem has a uniqueish id, for mathjax
      elMsg.attr('id', 'chat_message_' + Util.randomInt());

      // append the message to our box
      $(this.el).append(elMsg);

      // signal that we've rendered and added this elem (for mathjax, etc)
      Util.rendered(elMsg.children('span.math'));

// Does not work for the time being...
      // source popover
      elMsg.popover({
        title: function() { return 'Message Source'; },
        content: function() { return message.text; },
        placement: 'right',
        trigger: 'click',
        stayOnHover: true,
      });

    }
  },


// Removed timestamps
  msgTemplate: _.template('<div class="chat-message">\
      <span class="name"><%- name %>:</span>\
      <span class="math"><%- text %></span>\
      <span class="text tex2jax_ignore"><%- text %></span>\
    </div>\
  '),
  // html-escape all values


});

return ChatView;
});
