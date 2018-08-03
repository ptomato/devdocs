(function () {
  let SIDEBAR_HIDDEN_LAYOUT = undefined;
  const Cls = (app.views.Settings = class Settings extends app.View {
    constructor(...args) {
      super(...args);

      this.onChange = this.onChange.bind(this);
      this.onEnter = this.onEnter.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.onImport = this.onImport.bind(this);
      this.onClick = this.onClick.bind(this);
      this.onAppCacheProgress = this.onAppCacheProgress.bind(this);

      this.addSubview(this.docPicker = new app.views.DocPicker);
    }

    static initClass() {
      SIDEBAR_HIDDEN_LAYOUT = '_sidebar-hidden';

      this.el = '._settings';

      this.elements = {
        sidebar: '._sidebar',
        saveBtn: 'button[type="submit"]',
        backBtn: 'button[data-back]'
      };

      this.events = {
        import: 'onImport',
        change: 'onChange',
        submit: 'onSubmit',
        click: 'onClick'
      };

      this.shortcuts = {
        enter: 'onEnter'
      };
    }

    activate() {
      if (super.activate(...arguments)) {
        this.render();
        document.body.classList.remove(SIDEBAR_HIDDEN_LAYOUT);
        if (app.appCache != null) {
          app.appCache.on('progress', this.onAppCacheProgress);
        }
      }
    }

    deactivate() {
      if (super.deactivate(...arguments)) {
        this.resetClass();
        this.docPicker.detach();
        if (app.settings.hasLayout(SIDEBAR_HIDDEN_LAYOUT)) {
          document.body.classList.add(SIDEBAR_HIDDEN_LAYOUT);
        }
        if (app.appCache != null) {
          app.appCache.off('progress', this.onAppCacheProgress);
        }
      }
    }

    render() {
      this.docPicker.appendTo(this.sidebar);
      this.refreshElements();
      this.addClass('_in');
    }

    save(options) {
      if (options == null) {
        options = {};
      }
      if (!this.saving) {
        let docs;
        this.saving = true;

        if (options.import) {
          docs = app.settings.getDocs();
        } else {
          docs = this.docPicker.getSelectedDocs();
          app.settings.setDocs(docs);
        }

        this.saveBtn.textContent = app.appCache ? 'Downloading\u2026' : 'Saving\u2026';
        const disabledDocs = new app.collections.Docs((() => {
          const result = [];
          for (let doc of app.docs.all()) {
            if (docs.indexOf(doc.slug) === -1) {
              result.push(doc);
            }
          }
          return result;
        })());
        disabledDocs.uninstall(function () {
          app.db.migrate();
          return app.reload();
        });
      }
    }

    onChange() {
      this.addClass('_dirty');
    }

    onEnter() {
      this.save();
    }

    onSubmit(event) {
      event.preventDefault();
      this.save();
    }

    onImport() {
      this.addClass('_dirty');
      this.save({
        import: true
      });
    }

    onClick(event) {
      if (event.which !== 1) {
        return;
      }
      if (event.target === this.backBtn) {
        $.stopEvent(event);
        app.router.show('/');
      }
    }

    onAppCacheProgress(event) {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded * 100) / event.total);
        this.saveBtn.textContent = `Downloading\u2026 (${percentage}%)`;
      }
    }
  });
  Cls.initClass();
  return Cls;
})();
