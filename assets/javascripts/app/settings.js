/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
(function() {
  let PREFERENCE_KEYS = undefined;
  let INTERNAL_KEYS = undefined;
  const Cls = (app.Settings = class Settings {
    static initClass() {
      PREFERENCE_KEYS = [
        'hideDisabled',
        'hideIntro',
        'manualUpdate',
        'fastScroll',
        'arrowScroll',
        'docs',
        'dark',
        'layout',
        'size',
        'tips'
      ];
  
      INTERNAL_KEYS = [
        'count',
        'schema',
        'version',
        'news'
      ];
  
      this.defaults = {
        count: 0,
        hideDisabled: false,
        hideIntro: false,
        news: 0,
        manualUpdate: false,
        schema: 1
      };
    }

    constructor() {
      this.store = new CookieStore;
      this.cache = {};
    }

    get(key) {
      let left;
      if (this.cache.hasOwnProperty(key)) { return this.cache[key]; }
      return this.cache[key] = (left = this.store.get(key)) != null ? left : this.constructor.defaults[key];
    }

    set(key, value) {
      this.store.set(key, value);
      delete this.cache[key];
    }

    del(key) {
      this.store.del(key);
      delete this.cache[key];
    }

    hasDocs() {
      try { return !!this.store.get('docs'); } catch (error) {}
    }

    getDocs() {
      return __guard__(this.store.get('docs'), x => x.split('/')) || app.config.default_docs;
    }

    setDocs(docs) {
      this.set('docs', docs.join('/'));
    }

    getTips() {
      return __guard__(this.store.get('tips'), x => x.split('/')) || [];
    }

    setTips(tips) {
      this.set('tips', tips.join('/'));
    }

    setLayout(name, enable) {
      const layout = (this.store.get('layout') || '').split(' ');
      $.arrayDelete(layout, '');

      if (enable) {
        if (layout.indexOf(name) === -1) { layout.push(name); }
      } else {
        $.arrayDelete(layout, name);
      }

      if (layout.length > 0) {
        this.set('layout', layout.join(' '));
      } else {
        this.del('layout');
      }
    }

    hasLayout(name) {
      const layout = (this.store.get('layout') || '').split(' ');
      return layout.indexOf(name) !== -1;
    }

    setSize(value) {
      this.set('size', value);
    }

    dump() {
      return this.store.dump();
    }

    export() {
      const data = this.dump();
      for (let key of Array.from(INTERNAL_KEYS)) { delete data[key]; }
      return data;
    }

    import(data) {
      let value;
      const object = this.export();
      for (var key in object) {
        value = object[key];
        if (!data.hasOwnProperty(key)) { this.del(key); }
      }
      for (key in data) {
        value = data[key];
        if (PREFERENCE_KEYS.indexOf(key) !== -1) { this.set(key, value); }
      }
    }

    reset() {
      this.store.reset();
      this.cache = {};
    }
  });
  Cls.initClass();
  return Cls;
})();

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}