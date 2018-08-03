/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Cls = (app.views.Menu = class Menu extends app.View {
  constructor(...args) {
    {
      // Hack: trick Babel/TypeScript into allowing this before super.
      if (false) {
        super();
      }
      let thisFn = (() => {
        return this;
      }).toString();
      let thisName = thisFn.slice(thisFn.indexOf('return') + 6 + 1, thisFn.indexOf(';')).trim();
      eval(`${thisName} = this;`);
    }
    this.onGlobalClick = this.onGlobalClick.bind(this);
    super(...args);
  }

  static initClass() {
    this.el = '._menu';
    this.activeClass = 'active';

    this.events = {
      click: 'onClick'
    };
  }

  init() {
    $.on(document.body, 'click', this.onGlobalClick);
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
});
Cls.initClass();
