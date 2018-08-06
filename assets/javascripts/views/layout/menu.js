app.views.Menu = class Menu extends app.View {
  constructor(...args) {
    super(...args);

    this.onGlobalClick = this.onGlobalClick.bind(this);
    $.on(document.body, 'click', this.onGlobalClick);
  }

  static initClass() {
    this.el = '._menu';
    this.activeClass = 'active';

    this.events = {
      click: 'onClick'
    };
  }

  onClick(event) {
    const target = $.eventTarget(event);
    if (target.tagName === 'A') {
      target.blur();
    }
  }

  onGlobalClick(event) {
    if (event.which !== 1) {
      return;
    }
    if (typeof event.target.hasAttribute === 'function' ? event.target.hasAttribute('data-toggle-menu') : undefined) {
      this.toggleClass(this.constructor.activeClass);
    } else if (this.hasClass(this.constructor.activeClass)) {
      this.removeClass(this.constructor.activeClass);
    }
  }
};
app.views.Menu.initClass();
