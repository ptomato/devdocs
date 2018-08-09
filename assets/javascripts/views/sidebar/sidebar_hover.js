app.views.SidebarHover = class SidebarHover extends app.View {
  static initClass() {
    this.itemClass = '_list-hover';

    this.events = {
      focus: 'onFocus',
      blur: 'onBlur',
      mouseover: 'onMouseover',
      mouseout: 'onMouseout',
      scroll: 'onScroll',
      click: 'onClick'
    };

    this.routes = {
      after: 'onRoute'
    };
  }

  constructor(el) {
    super(...arguments);
    this.position = this.position.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onMouseover = this.onMouseover.bind(this);
    this.onMouseout = this.onMouseout.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onRoute = this.onRoute.bind(this);
    this.el = el;

    // TODO Cleanup (el_)
    const el_ = document.createElement('div');
    el_.style.cssText = 'pointer-events: auto';

    if (el_.style.pointerEvents !== 'auto') {
      delete this.constructor.events.mouseover;
    }
  }

  show(el) {
    if (el !== this.cursor) {
      this.hide();
      if (this.isTarget(el) && this.isTruncated(el.lastElementChild || el)) {
        this.cursor = el;
        this.clone = this.makeClone(this.cursor);
        $.append(document.body, this.clone);
        if (this.offsetTop == null) {
          this.offsetTop = this.el.offsetTop;
        }
        this.position();
      }
    }
  }

  hide() {
    if (this.cursor) {
      $.remove(this.clone);
      this.cursor = (this.clone = null);
    }
  }

  position() {
    if (this.cursor) {
      const rect = $.rect(this.cursor);
      if (rect.top >= this.offsetTop) {
        this.clone.style.top = rect.top + 'px';
        this.clone.style.left = rect.left + 'px';
      } else {
        this.hide();
      }
    }
  }

  makeClone(el) {
    const clone = el.cloneNode(true);
    clone.classList.add('clone');
    return clone;
  }

  isTarget(el) {
    if (el != null && el.classList) {
      return el.classList.contains(this.constructor.itemClass);
    }

    return false;
  }

  isSelected(el) {
    return el.classList.contains('active');
  }

  isTruncated(el) {
    return el.scrollWidth > el.offsetWidth;
  }

  onFocus(event) {
    this.focusTime = Date.now();
    this.show(event.target);
  }

  onBlur() {
    this.hide();
  }

  onMouseover(event) {
    if (this.isTarget(event.target) && !this.isSelected(event.target) && this.mouseActivated()) {
      this.show(event.target);
    }
  }

  onMouseout(event) {
    if (this.isTarget(event.target) && this.mouseActivated()) {
      this.hide();
    }
  }

  mouseActivated() {
    // Skip mouse events caused by focus events scrolling the sidebar.
    return !this.focusTime || ((Date.now() - this.focusTime) > 500);
  }

  onScroll() {
    this.position();
  }

  onClick(event) {
    if (event.target === this.clone) {
      $.click(this.cursor);
    }
  }

  onRoute() {
    this.hide();
  }
};
app.views.SidebarHover.initClass();
