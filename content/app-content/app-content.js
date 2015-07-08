Polymer({
  is: 'app-content',

  ready: function() {
    var calculateOffsets = this.calculateOffsets.bind(this);

    window.addEventListener('resize', calculateOffsets);
    setTimeout(calculateOffsets, 1);
  },

  calculateOffsets: function() {
   this.headingInfos = [].slice.call(this.querySelectorAll('h2, h3'))
      .map(function(heading) {
        return {
          top: heading.offsetTop - 10,
          href: '#' + heading.id
        };
      });
  },

  handleScroll: function(e) {
    if (!this.headingInfos || !history || !history.replaceState) {
      return;
    }

    var target = e.detail.target;
    var offset = target.scrollTop;
    var height = target.offsetHeight;
    var scrollHeight = target.scrollHeight;

    if (scrollHeight - (offset + height) < 5) {
      return;
    }

    this.headingInfos
      .filter(function(headingInfo) {
        return headingInfo.top < offset;
      })
      .slice(-1)
      .forEach(function(headingInfo) {
        history.replaceState(null, '', headingInfo.href);
        window.dispatchEvent(new CustomEvent('app:replacestate'));
      });
  }
});
