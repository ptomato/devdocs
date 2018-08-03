/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
//= require views/pages/base

const Cls = (app.views.SqlitePage = class SqlitePage extends app.views.BasePage {
  constructor(...args) {
    {
      // Hack: trick Babel/TypeScript into allowing this before super.
      if (false) { super(); }
      let thisFn = (() => { return this; }).toString();
      let thisName = thisFn.slice(thisFn.indexOf('return') + 6 + 1, thisFn.indexOf(';')).trim();
      eval(`${thisName} = this;`);
    }
    this.onClick = this.onClick.bind(this);
    super(...args);
  }

  static initClass() {
    this.events =
      {click: 'onClick'};
  }

  onClick(event) {
    let el, id;
    if (!(id = event.target.getAttribute('data-toggle'))) { return; }
    if (!(el = this.find(`#${id}`))) { return; }
    $.stopEvent(event);
    if (el.style.display === 'none') {
      el.style.display = 'block';
      event.target.textContent = 'hide';
    } else {
      el.style.display = 'none';
      event.target.textContent = 'show';
    }
  }
});
Cls.initClass();
