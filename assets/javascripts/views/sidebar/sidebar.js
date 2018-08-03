app.views.Sidebar = class Sidebar extends app.View {
  constructor(...args) {
    super(...args);

    this.resetHoverOnMouseMove = this.resetHoverOnMouseMove.bind(this);
    this.resetHover = this.resetHover.bind(this);
    this.showResults = this.showResults.bind(this);
    this.onReady = this.onReady.bind(this);
    this.onScopeChange = this.onScopeChange.bind(this);
    this.onSearching = this.onSearching.bind(this);
    this.onSearchClear = this.onSearchClear.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onAltR = this.onAltR.bind(this);
    this.onEscape = this.onEscape.bind(this);
    this.afterRoute = this.afterRoute.bind(this);

    if (!app.isMobile()) {
      this.addSubview(this.hover = new app.views.SidebarHover(this.el));
    }
    this.addSubview(this.search = new app.views.Search);

    this.search
      .on('searching', this.onSearching)
      .on('clear', this.onSearchClear)
      .scope
      .on('change', this.onScopeChange);

    this.results = new app.views.Results(this, this.search);
    this.docList = new app.views.DocList;

    app.on('ready', this.onReady);

    $.on(document.documentElement, 'mouseleave', event => {
      if (event.clientX < 10) {
        return this.display();
      }
    });
    $.on(document.documentElement, 'mouseenter', () => this.resetDisplay({
      forceNoHover: false
    }));
  }

  static initClass() {
    this.el = '._sidebar';

    this.events = {
      focus: 'onFocus',
      select: 'onSelect',
      click: 'onClick'
    };

    this.routes = {
      after: 'afterRoute'
    };

    this.shortcuts = {
      altR: 'onAltR',
      escape: 'onEscape'
    };

    return this;
  }

  display() {
    this.addClass('show');
  }

  resetDisplay(options) {
    if (options == null) {
      options = {};
    }
    if (!this.hasClass('show')) {
      return;
    }
    this.removeClass('show');

    if ((options.forceNoHover !== false) && !this.hasClass('no-hover')) {
      this.addClass('no-hover');
      $.on(window, 'mousemove', this.resetHoverOnMouseMove);
    }
  }

  resetHoverOnMouseMove() {
    $.off(window, 'mousemove', this.resetHoverOnMouseMove);
    return $.requestAnimationFrame(this.resetHover);
  }

  resetHover() {
    return this.removeClass('no-hover');
  }

  showView(view) {
    if (this.view !== view) {
      if (this.hover != null) {
        this.hover.hide();
      }
      this.saveScrollPosition();
      if (this.view != null) {
        this.view.deactivate();
      }
      this.view = view;
      this.render();
      this.view.activate();
      this.restoreScrollPosition();
    }
  }

  render() {
    this.html(this.view);
  }

  showDocList() {
    this.showView(this.docList);
  }

  showResults() {
    this.display();
    this.showView(this.results);
  }

  reset() {
    this.display();
    this.showDocList();
    this.docList.reset();
    this.search.reset();
  }

  onReady() {
    this.view = this.docList;
    this.render();
    this.view.activate();
  }

  onScopeChange(newDoc, previousDoc) {
    if (previousDoc) {
      this.docList.closeDoc(previousDoc);
    }
    if (newDoc) {
      this.docList.reveal(newDoc.toEntry());
    } else {
      this.scrollToTop();
    }
  }

  saveScrollPosition() {
    if (this.view === this.docList) {
      this.scrollTop = this.el.scrollTop;
    }
  }

  restoreScrollPosition() {
    if ((this.view === this.docList) && this.scrollTop) {
      this.el.scrollTop = this.scrollTop;
      this.scrollTop = null;
    } else {
      this.scrollToTop();
    }
  }

  scrollToTop() {
    this.el.scrollTop = 0;
  }

  onSearching() {
    this.showResults();
  }

  onSearchClear() {
    this.resetDisplay();
    this.showDocList();
  }

  onFocus(event) {
    this.display();
    if (event.target !== this.el) {
      $.scrollTo(event.target, this.el, 'continuous', {
        bottomGap: 2
      });
    }
  }

  onSelect() {
    this.resetDisplay();
  }

  onClick(event) {
    if (event.which !== 1) {
      return;
    }

    let target = $.eventTarget(event);

    // TODO: Cleanup
    if (target && typeof target.hasAttribute !== 'undefined' && target.hasAttribute && target.hasAttribute('data-reset-list')) {
      $.stopEvent(event);
      this.onAltR();
    }
  }

  onAltR() {
    this.reset();
    this.docList.reset({
      revealCurrent: true
    });
    this.display();
  }

  onEscape() {
    let doc;
    this.reset();
    this.resetDisplay();
    if ((doc = this.search.getScopeDoc())) {
      this.docList.reveal(doc.toEntry());
    } else {
      this.scrollToTop();
    }
  }

  onDocEnabled() {
    this.docList.onEnabled();
    this.reset();
  }

  afterRoute(name, context) {
    if ((app.shortcuts.eventInProgress != null ? app.shortcuts.eventInProgress.name : undefined) === 'escape') {
      return;
    }
    if (!context.init && app.router.isIndex()) {
      this.reset();
    }
    this.resetDisplay();
  }
}.initClass();