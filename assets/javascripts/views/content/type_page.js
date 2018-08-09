app.views.TypePage = class TypePage extends app.View {
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
};
app.views.TypePage.initClass();
