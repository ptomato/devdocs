app.views.Resizer = class Resizer extends app.View {
  constructor(...args) {
    super(...args);

    this.onDragStart = this.onDragStart.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

    this.el.setAttribute('draggable', 'true');
    this.appendTo($('._app'));

    this.style = $('style[data-resizer]');
    this.size = this.style.getAttribute('data-size');
  }

  static initClass() {
    this.className = '_resizer';

    this.events = {
      dragstart: 'onDragStart',
      dragend: 'onDragEnd'
    };

    this.MIN = 260;
    this.MAX = 600;
  }

  static isSupported() {
    return 'ondragstart' in document.createElement('div') && !app.isMobile();
  }

  resize(value, save) {
    value -= app.el.offsetLeft;
    if (!(value > 0)) {
      return;
    }
    value = Math.min(Math.max(Math.round(value), Resizer.MIN), Resizer.MAX);
    const newSize = `${value}px`;
    this.style.innerHTML = this.style.innerHTML.replace(new RegExp(this.size, 'g'), newSize);
    this.size = newSize;
    if (save) {
      app.settings.setSize(value);
      if (app.appCache != null) {
        app.appCache.updateInBackground();
      }
    }
  }

  onDragStart(event) {
    this.style.removeAttribute('disabled');
    event.dataTransfer.effectAllowed = 'link';
    event.dataTransfer.setData('Text', '');
    $.on(window, 'dragover', this.onDrag);
  }

  onDrag(event) {
    const value = event.pageX;
    if (!(value > 0)) {
      return;
    }
    this.lastDragValue = value;
    if (this.lastDrag && (this.lastDrag > (Date.now() - 50))) {
      return;
    }
    this.lastDrag = Date.now();
    this.resize(value, false);
  }

  onDragEnd(event) {
    $.off(window, 'dragover', this.onDrag);
    let value = event.pageX || (event.screenX - window.screenX);
    if (this.lastDragValue && !(this.lastDragValue - 5 < value && value < this.lastDragValue + 5)) { // https://github.com/freeCodeCamp/devdocs/issues/265
      value = this.lastDragValue;
    }
    this.resize(value, true);
  }
};
app.views.Resizer.initClass();