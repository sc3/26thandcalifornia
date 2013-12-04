/* Github issues API Backbone components */

var GithubIssuesTemplate = ' \
<% _.each(issues, function(issue) { %> \
  <div class="issue"> \
    <p class="title"> \
      <a href="<%= issue.html_url %>" target="_blank"><%= issue.title %></a> \
      <% _.each(issue.labels, function(label) { %> \
        <% if (label.abbreviated_name) { %> \
        <span class="issue-label label" style="background-color: #<%= label.color %>"><%= label.abbreviated_name %></span> \
        <% } %> \
      <% }) %> \
    </p> \
    <%= issue.body %> \
  </div> \
<% }); %> \
';

var GithubIssuesCollection = Backbone.Collection.extend({
  initialize: function(data, o) {
    this.options = o || {};
  },
  sync: function(method, model, options) {
    var params = $.extend(true, {
      type: 'GET',
      dataType: 'json',
      cache: true,
      data: $.extend({
        state: 'open',
      }, this.options.params),
      url: this.options.url,
    }, options);
    return $.ajax(params);
  },
  parse: function(data) {
    var converter = new Showdown.converter();
    _.each(data, function(issue) {
      issue.body = converter.makeHtml(issue.body);
      issue.labels = _.map(issue.labels, function(label) {
        if (label.name.substring(0, 5) != "page:")
          label.abbreviated_name = label.name.split(": ").pop();
        return label;
      });
    });
    return data;
  },
});

var GithubIssuesView = Backbone.View.extend({
  initialize: function(o) {
    this.template = (o.template) ? _.template(o.template) 
                                 : _.template(GithubIssuesTemplate);
    this.collection.bind('sync', this.render, this);
  },
  render: function() {
    this.$el.empty();
    this.$el.html(this.template({
      issues: this.collection.toJSON()
    }));
    return this;
  }
});

