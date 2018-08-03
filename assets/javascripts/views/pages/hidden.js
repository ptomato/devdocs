/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Cls = (app.views.HiddenPage = class HiddenPage extends app.View {
  static initClass() {
    this.events = {
      click: 'onClick'
    };
  }

  constructor(el, entry) {
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
    this.onClick = this.onClick.bind(this);
    this.el = el;
    this.entry = entry;
    super(...arguments);
  }

  init() {
    this.addSubview(this.notice = new app.views.Notice('disabledDoc'));
    this.activate();
  }

  onClick(event) {
    let link;
    if (link = $.closestLink(event.target, this.el)) {
      $.stopEvent(event);
      $.popup(link);
    }
  }
});
Cls.initClass();
