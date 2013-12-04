var average = function(array){
  return array.reduce(function(a, b){return parseInt(a) + parseInt(b);})/array.length;
}

var JailCollection = Backbone.Collection.extend({
  initialize: function(data, o) {
    this.options = o || {};
  },
  url: function() {
    return this.options.url;
  },
  sortAscending: false,
  sortByAttributeKey: 'date',
  comparator: function(lhs, rhs) {
    var compare = null,
    val_lhs = lhs.get(this.sortByAttributeKey),
    val_rhs = rhs.get(this.sortByAttributeKey);
    switch(typeof(val_lhs)){
      case "string":
        compare = val_lhs.localeCompare(val_rhs);
        break;

      case "number":
        compare =  val_lhs - val_rhs;
        break;
    }
    return this.sortAscending ? compare : -compare;
  },
  average: function(key) {
    this.sort();
    return average(_.pluck(this.toJSON(), key));
  }
});
