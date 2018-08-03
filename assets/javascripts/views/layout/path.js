/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Cls = (app.views.Path = class Path extends app.View {
  constructor(...args) {
    {
      // Hack: trick Babel/TypeScript into allowing this before super.
      if (false) { super(); }
      let thisFn = (() => { return this; }).toString();
      let thisName = thisFn.slice(thisFn.indexOf('return') + 6 + 1, thisFn.indexOf(';')).trim();
      eval(`${thisName} = this;`);
    }
    this.onClick = this.onClick.bind(this);
    this.afterRoute = this.afterRoute.bind(this);
    super(...args);
  }

  static initClass() {
    this.className = '_path';
    this.attributes =
      {role: 'complementary'};
  
    this.events =
      {click: 'onClick'};
  
    this.routes =
      {after: 'afterRoute'};
  }

  render(...args) {
    this.html(this.tmpl('path', ...Array.from(args)));
    this.show();
  }

  show() {
    if (!this.el.parentNode) { this.prependTo(app.el); }
  }

  hide() {
    if (this.el.parentNode) { $.remove(this.el); }
  }

  onClick(event) {
    let link;
    if (link = $.closestLink(event.target, this.el)) { this.clicked = true; }
  }

  afterRoute(route, context) {
    if (context.type) {
      this.render(context.doc, context.type);
    } else if (context.entry) {
      if (context.entry.isIndex()) {
        this.render(context.doc);
      } else {
        this.render(context.doc, context.entry.getType(), context.entry);
      }
    } else {
      this.hide();
    }

    if (this.clicked) {
      this.clicked = null;
      app.document.sidebar.reset();
    }
  }
});
Cls.initClass();
