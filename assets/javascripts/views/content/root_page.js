/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Cls = (app.views.RootPage = class RootPage extends app.View {
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

  init() {
    if (!this.isHidden()) { this.setHidden(false); } // reserve space in local storage
    this.render();
  }

  render() {
    this.empty();

    let tmpl = app.isAndroidWebview() ?
      'androidWarning'
    : this.isHidden() ?
      'splash'
    : app.isMobile() ?
      'mobileIntro'
    :
      'intro';

    // temporary
    if ((location.host === 'devdocs.io') && (location.protocol === 'http:')) {
      tmpl = 'httpWarning';
    }

    this.append(this.tmpl(tmpl));
  }

  hideIntro() {
    this.setHidden(true);
    this.render();
  }

  setHidden(value) {
    app.settings.set('hideIntro', value);
  }

  isHidden() {
    return app.isSingleDoc() || app.settings.get('hideIntro');
  }

  onRoute() {}

  onClick(event) {
    if ($.eventTarget(event).hasAttribute('data-hide-intro')) {
      $.stopEvent(event);
      this.hideIntro();
    }
  }
});
Cls.initClass();
