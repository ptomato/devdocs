/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Cls = (app.views.Notice = class Notice extends app.View {
  static initClass() {
    this.className = '_notice';
    this.attributes = {
      role: 'alert'
    };
  }

  constructor(type, ...rest) {
    { // Hack: trick Babel/TypeScript into allowing this before super.
      if (false) {
        super();
      }
      let thisFn = (() => {
        return this;
      }).toString();
      let thisName = thisFn.slice(thisFn.indexOf('return') + 6 + 1, thisFn.indexOf(';')).trim();
      eval(`${thisName} = this;`);
    }
    this.type = type;
    [...this.args] = Array.from(rest);
    super(...arguments);
  }

  init() {
    this.activate();
  }

  activate() {
    if (super.activate(...arguments)) {
      this.show();
    }
  }

  deactivate() {
    if (super.deactivate(...arguments)) {
      this.hide();
    }
  }

  show() {
    this.html(this.tmpl(`${this.type}Notice`, ...Array.from(this.args)));
    this.prependTo(app.el);
  }

  hide() {
    $.remove(this.el);
  }
});
Cls.initClass();
