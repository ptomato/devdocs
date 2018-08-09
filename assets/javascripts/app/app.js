this.app = {
  _$: $,
  _$$: $$,
  _page: page,
  collections: {},
  models: {},
  templates: {},
  views: {},

  init() {
    try {
      this.initErrorTracking();
    } catch (error) {}
    if (!this.browserCheck()) {
      return;
    }

    this.el = $('._app');
    this.localStorage = new LocalStorageStore;
    if (app.AppCache.isEnabled()) {
      this.appCache = new app.AppCache;
    }
    this.settings = new app.Settings;
    this.db = new app.DB();

    this.docs = new app.collections.Docs;
    this.disabledDocs = new app.collections.Docs;
    this.entries = new app.collections.Entries;

    this.router = new app.Router;
    this.shortcuts = new app.Shortcuts;
    this.document = new app.views.Document;
    if (this.isMobile()) {
      this.mobile = new app.views.Mobile;
    }

    if (document.body.hasAttribute('data-doc')) {
      this.DOC = JSON.parse(document.body.getAttribute('data-doc'));
      this.bootOne();
    } else if (this.DOCS) {
      this.bootAll();
    } else {
      this.onBootError();
    }
  },

  browserCheck() {
    if (this.isSupportedBrowser()) {
      return true;
    }
    document.body.innerHTML = app.templates.unsupportedBrowser;
    this.hideLoadingScreen();
    return false;
  },

  initErrorTracking() {
    // Show a warning message and don't track errors when the app is loaded
    // from a domain other than our own, because things are likely to break.
    // (e.g. cross-domain requests)
    if (this.isInvalidLocation()) {
      let notif = new app.views.Notif('InvalidLocation');
      notif.show();
    } else {
      if (this.config.sentry_dsn) {
        Raven.config(this.config.sentry_dsn, {
          release: this.config.release,
          whitelistUrls: [/devdocs/],
          includePaths: [/devdocs/],
          ignoreErrors: [/NPObject/, /NS_ERROR/, /^null$/, /EvalError/],
          tags: {
            mode: this.isSingleDoc() ? 'single' : 'full',
            iframe: (window.top !== window).toString(),
            // TODO electron: (!!__guard__(window.process != null ? window.process.versions : undefined, x => x.electron)).toString()
          },
          shouldSendCallback: () => {
            try {
              if (this.isInjectionError()) {
                this.onInjectionError();
                return false;
              }
              if (this.isAndroidWebview()) {
                return false;
              }
            } catch (error) {}
            return true;
          },
          dataCallback(data) {
            try {
              $.extend(data.user || (data.user = {}), app.settings.dump());
              if (data.user.docs) {
                data.user.docs = data.user.docs.split('/');
              }
              if (app.lastIDBTransaction) {
                data.user.lastIDBTransaction = app.lastIDBTransaction;
              }
              data.tags.scriptCount = document.scripts.length;
            } catch (error) {}
            return data;
          }
        }).install();
      }
      this.previousErrorHandler = onerror;
      window.onerror = this.onWindowError.bind(this);
      CookieStore.onBlocked = this.onCookieBlocked;
    }
  },

  bootOne() {
    this.doc = new app.models.Doc(this.DOC);
    this.docs.reset([this.doc]);
    this.doc.load(this.start.bind(this), this.onBootError.bind(this), {
      readCache: true
    });
    new app.views.Notice('singleDoc', this.doc);
    delete this.DOC;
  },

  bootAll() {
    const docs = this.settings.getDocs();
    for (let doc of this.DOCS) {
      (docs.indexOf(doc.slug) >= 0 ? this.docs : this.disabledDocs).add(doc);
    }
    this.migrateDocs();
    this.docs.load(this.start.bind(this), this.onBootError.bind(this), {
      readCache: true,
      writeCache: true
    });
    delete this.DOCS;
  },

  start() {
    for (var doc of this.docs.all()) {
      this.entries.add(doc.toEntry());
    }
    for (doc of this.disabledDocs.all()) {
      this.entries.add(doc.toEntry());
    }
    for (doc of this.docs.all()) {
      this.initDoc(doc);
    }
    this.trigger('ready');
    this.router.start();
    this.hideLoadingScreen();
    setTimeout(() => {
      if (!this.doc) {
        this.welcomeBack();
      }
      return this.removeEvent('ready bootError');
    }, 50);
  },

  initDoc(doc) {
    for (let type of doc.types.all()) {
      doc.entries.add(type.toEntry());
    }
    this.entries.add(doc.entries.all());
  },

  migrateDocs() {
    let needsSaving;
    for (let slug of this.settings.getDocs()) {
      if (!this.docs.findBy('slug', slug)) {
        var doc;

        needsSaving = true;
        if (slug === 'webpack~2') {
          doc = this.disabledDocs.findBy('slug', 'webpack');
        }
        if (slug === 'angular~4_typescript') {
          doc = this.disabledDocs.findBy('slug', 'angular');
        }
        if (slug === 'angular~2_typescript') {
          doc = this.disabledDocs.findBy('slug', 'angular~2');
        }
        if (!doc) {
          doc = this.disabledDocs.findBy('slug_without_version', slug);
        }
        if (doc) {
          this.disabledDocs.remove(doc);
          this.docs.add(doc);
        }
      }
    }

    if (needsSaving) {
      this.saveDocs();
    }
  },

  enableDoc(doc, _onSuccess, onError) {
    if (this.docs.contains(doc)) {
      return;
    }

    const onSuccess = () => {
      if (this.docs.contains(doc)) {
        return;
      }
      this.disabledDocs.remove(doc);
      this.docs.add(doc);
      this.docs.sort();
      this.initDoc(doc);
      this.saveDocs();
      _onSuccess();
    };

    doc.load(onSuccess, onError, {
      writeCache: true
    });
  },

  saveDocs() {
    this.settings.setDocs(this.docs.all().map((doc) => doc.slug));
    this.db.migrate();
    return (this.appCache != null ? this.appCache.updateInBackground() : undefined);
  },

  welcomeBack() {
    let visitCount = this.settings.get('count');
    this.settings.set('count', ++visitCount);
    if (visitCount === 5) {
      let notif = new app.views.Notif('Share', {
        autoHide: null
      });
      notif.show();
    }
    new app.views.News();
    new app.views.Updates();
    return this.updateChecker = new app.UpdateChecker();
  },

  reload() {
    this.docs.clearCache();
    this.disabledDocs.clearCache();
    if (this.appCache) {
      this.appCache.reload();
    } else {
      window.location = '/';
    }
  },

  reset() {
    this.localStorage.reset();
    this.settings.reset();
    if (this.db != null) {
      this.db.reset();
    }
    if (this.appCache != null) {
      this.appCache.update();
    }
    window.location = '/';
  },

  showTip(tip) {
    if (this.isSingleDoc()) {
      return;
    }
    const tips = this.settings.getTips();
    if (tips.indexOf(tip) === -1) {
      tips.push(tip);
      this.settings.setTips(tips);
      new app.views.Tip(tip);
    }
  },

  hideLoadingScreen() {
    if ($.overlayScrollbarsEnabled()) {
      document.body.classList.add('_overlay-scrollbars');
    }
    document.documentElement.classList.remove('_booting');
  },

  indexHost() {
    // Can't load the index files from the host/CDN when applicationCache is
    // enabled because it doesn't support caching URLs that use CORS.
    return this.config[this.appCache && this.settings.hasDocs() ? 'index_path' : 'docs_origin'];
  },

  onBootError(...args) {
    this.trigger('bootError');
    this.hideLoadingScreen();
  },

  onQuotaExceeded() {
    if (this.quotaExceeded) {
      return;
    }
    this.quotaExceeded = true;
    let notif = new app.views.Notif('QuotaExceeded', {
      autoHide: null
    });
    notif.show();
  },

  onCookieBlocked(key, value, actual) {
    if (this.cookieBlocked) {
      return;
    }
    this.cookieBlocked = true;
    let notif = new app.views.Notif('CookieBlocked', {
      autoHide: null
    });
    notif.show();
    Raven.captureMessage(`CookieBlocked/${key}`, {
      level: 'warning',
      extra: {
        value,
        actual
      }
    });
  },

  onWindowError(...args) {
    if (this.cookieBlocked) {
      return;
    }
    if (this.isInjectionError(...Array.from(args || []))) {
      this.onInjectionError();
    } else if (this.isAppError(...Array.from(args || []))) {
      if (typeof this.previousErrorHandler === 'function') {
        this.previousErrorHandler(...Array.from(args || []));
      }
      this.hideLoadingScreen();
      if (!this.errorNotif) {
        this.errorNotif = new app.views.Notif('Error');
      }
      this.errorNotif.show();
    }
  },

  onInjectionError() {
    if (!this.injectionError) {
      this.injectionError = true;
      alert(`\
JavaScript code has been injected in the page which prevents DevDocs from running correctly.
Please check your browser extensions/addons. `);
      Raven.captureMessage('injection error', {
        level: 'info'
      });
    }
  },

  isInjectionError() {
    // Some browser extensions expect the entire web to use jQuery.
    // I gave up trying to fight back.
    return (window.$ !== app._$) || (window.$$ !== app._$$) || (window.page !== app._page) || (typeof $.empty !== 'function') || (typeof page.show !== 'function');
  },

  isAppError(error, file) {
    // Ignore errors from external scripts.
    return file && (file.indexOf('devdocs') !== -1) && (file.indexOf('.js') === (file.length - 3));
  },

  isSupportedBrowser() {
    try {
      const features = {
        bind: !!Function.prototype.bind,
        pushState: !!history.pushState,
        matchMedia: !!window.matchMedia,
        insertAdjacentHTML: !!document.body.insertAdjacentHTML,
        defaultPrevented: document.createEvent('CustomEvent').defaultPrevented === false,
        cssGradients: supportsCssGradients()
      };

      for (let key in features) {
        const value = features[key];
        if (!value) {
          Raven.captureMessage(`unsupported/${key}`, {
            level: 'info'
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      Raven.captureMessage('unsupported/exception', {
        level: 'info',
        extra: {
          error
        }
      });
      return false;
    }
  },

  isSingleDoc() {
    return document.body.hasAttribute('data-doc');
  },

  isMobile() {
    return this._isMobile != null ? this._isMobile : (this._isMobile = app.views.Mobile.detect());
  },

  isAndroidWebview() {
    return this._isAndroidWebview != null ? this._isAndroidWebview : (this._isAndroidWebview = app.views.Mobile.detectAndroidWebview());
  },

  isInvalidLocation() {
    return (this.config.env === 'production') && (location.host.indexOf(app.config.production_host) !== 0);
  }
};

var supportsCssGradients = function () {
  const el = document.createElement('div');
  el.style.cssText = "background-image: -webkit-linear-gradient(top, #000, #fff); background-image: linear-gradient(to top, #000, #fff);";
  return el.style.backgroundImage.indexOf('gradient') >= 0;
};

$.extend(app, Events);