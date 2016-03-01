(function(scope) {
  var uidGen = 1;

  var MutationSetup = {
    uid: function() {
      return uidGen++;
    },

    randomPercent: function() {
      return (Math.random() - 0.5) * 0.3;
    },

    randomValue: function() {
      return Math.random() * 700;
    },

    randomChars: function() {
      return (Math.random() + 1).toString(36).substring(2, 10);
    },

    randomText: function(count) {
      var text = '';

      for (var i = 0; i < count; i += 1) {
        text += this.randomChars();
      }

      return text;
    },

    createItem: function() {
      return Object.freeze({
        key: '' + this.uid(),
        name: this.randomText(1),
        value: this.randomValue(),
        change: this.randomPercent()
      });
    },

    createItems: function(count) {
      var data = [];

      for (var i = 0; i < count; i += 1) {
        data[i] = this.createItem();
      }

      return data;
    },

    updateItems: function(items) {
      for (var i = 0; i < items.length; i += 1) {
        var change = this.randomPercent();
        items[i].value *= (1 + change);
        items[i].change = change;
      }
    }
  };

  scope.MutationSetup = MutationSetup;

}(window));
