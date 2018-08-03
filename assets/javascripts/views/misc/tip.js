//= require views/misc/notif

app.views.Tip = class Tip extends app.views.Notif {
  static initClass() {
    this.className = '_notif _notif-tip';

    this.defautOptions = {
      autoHide: false
    };

    return this;
  }

  render() {
    this.html(this.tmpl(`tip${this.type}`));
  }
}.initClass();
