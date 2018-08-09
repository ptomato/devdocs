app.views.HiddenPage = class HiddenPage extends app.View {
  static initClass() {
    this.events = {
      click: 'onClick'
    };
  }

  constructor(el, entry) {
    super(...arguments);

    this.onClick = this.onClick.bind(this);
    this.el = el;
    this.entry = entry;
    
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
};
app.views.HiddenPage.initClass();
