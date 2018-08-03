app.views.Notice = class Notice extends app.View {
  static initClass() {
    this.className = '_notice';
    this.attributes = {
      role: 'alert'
    };

    return this;
  }

  constructor(type, ...rest) {
    super(...arguments);

    this.type = type;
    [...this.args] = rest;

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
    this.html(this.tmpl(`${this.type}Notice`, ...this.args));
    this.prependTo(app.el);
  }

  hide() {
    $.remove(this.el);
  }
}.initClass();
