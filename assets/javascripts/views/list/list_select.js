app.views.ListSelect = class ListSelect extends app.View {
  static initClass() {
    this.activeClass = 'active';

    this.events = {
      click: 'onClick'
    };

    return this;
  }

  constructor(el) {
    super(...arguments);

    this.onClick = this.onClick.bind(this);
    this.el = el; 
  }

  deactivate() {
    if (super.deactivate(...arguments)) {
      this.deselect();
    }
  }

  select(el) {
    this.deselect();
    if (el) {
      el.classList.add(this.constructor.activeClass);
      $.trigger(el, 'select');
    }
  }

  deselect() {
    let selection;
    if (selection = this.getSelection()) {
      selection.classList.remove(this.constructor.activeClass);
      $.trigger(selection, 'deselect');
    }
  }

  selectByHref(href) {
    let selection = this.getSelection();

    if (selection && selection.getAttribute('href') !== href) {
      this.select(this.find(`a[href='${href}']`));
    }
  }

  selectCurrent() {
    this.selectByHref(location.pathname + location.hash);
  }

  getSelection() {
    return this.findByClass(this.constructor.activeClass);
  }

  onClick(event) {
    if ((event.which !== 1) || event.metaKey || event.ctrlKey) {
      return;
    }
    const target = $.eventTarget(event);
    if (target.tagName === 'A') {
      this.select(target);
    }
  }
}.initClass();
