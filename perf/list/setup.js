(function(scope) {
  var uidGen = 1;

  var ListSetup = {
    uid: function() {
      return uidGen++;
    },

    randomChars: function() {
      return (Math.random() + 1).toString(36).substring(2);
    },

    randomText: function(count) {
      var text = '';

      for (var i = 0; i < count; i += 1) {
        text += this.randomChars();
      }

      return text;
    },

    createItem: function() {
      var newId = ListSetup.uid();

      return {
        key: '' + newId,
        sender: this.randomText(1),
        subject: this.randomText(4),
        date: 'July 4'
      };
    },

    createItems: function(count) {
      var data = [];

      for (var i = 0; i < count; i += 1) {
        data[i] = ListSetup.createItem();
      }

      return data;
    }
  };

  scope.ListSetup = ListSetup;
}(window));
