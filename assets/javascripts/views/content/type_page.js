/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Cls = (app.views.TypePage = class TypePage extends app.View {
  static initClass() {
    this.className = '_page';
  }

  deactivate() {
    if (super.deactivate(...arguments)) {
      this.empty();
      this.type = null;
    }
  }

  render(type) {
    this.type = type;
    this.html(this.tmpl('typePage', this.type));
  }

  getTitle() {
    return `${this.type.doc.fullName} / ${this.type.name}`;
  }

  onRoute(context) {
    this.render(context.type);
  }
});
Cls.initClass();
