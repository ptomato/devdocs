app.views.RootPage = class RootPage extends app.View {
  constructor(...args) {
    super(...args);

    this.onClick = this.onClick.bind(this);

    if (!this.isHidden()) {
      this.setHidden(false);
    } // reserve space in local storage

    this.render();
  }

  static initClass() {
    this.events = {
      click: 'onClick'
    };
  }

  render() {
    this.empty();

    let tmpl = app.isAndroidWebview() ?
      'androidWarning' :
      this.isHidden() ?
      'splash' :
      app.isMobile() ?
      'mobileIntro' :
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
};
app.views.RootPage.initClass();
