/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Cls = (app.views.StaticPage = class StaticPage extends app.View {
  static initClass() {
    this.className = '_static';
  
    this.titles = {
      about:    'About',
      news:     'News',
      help:     'User Guide',
      notFound: '404'
    };
  }

  deactivate() {
    if (super.deactivate(...arguments)) {
      this.empty();
      this.page = null;
    }
  }

  render(page) {
    this.page = page;
    this.html(this.tmpl(`${this.page}Page`));
  }

  getTitle() {
    return this.constructor.titles[this.page];
  }

  onRoute(context) {
    this.render(context.page || 'notFound');
  }
});
Cls.initClass();
