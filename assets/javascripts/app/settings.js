app.Settings = class Settings {
  static initClass() {
    this.PREFERENCE_KEYS = [
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

    this.INTERNAL_KEYS = [
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
    if (this.cache.hasOwnProperty(key)) {
      return this.cache[key];
    }
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
    try {
      return !!this.store.get('docs');
    } catch (error) {}
  }

  getDocs() {
    let docs = this.store.get('docs');

    if (docs) {
      return docs.split('/');
    }

    return app.config.default_docs;
  }

  setDocs(docs) {
    this.set('docs', docs.join('/'));
  }

  getTips() {
    let tips = this.store.get('tips');
    if (tips != null) {
      return tips.split('/');
    }
    return [];
  }

  setTips(tips) {
    this.set('tips', tips.join('/'));
  }

  setLayout(name, enable) {
    const layout = (this.store.get('layout') || '').split(' ');
    $.arrayDelete(layout, '');

    if (enable) {
      if (layout.indexOf(name) === -1) {
        layout.push(name);
      }
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

  export () {
    const data = this.dump();
    for (let key of Settings.INTERNAL_KEYS) {
      delete data[key];
    }
    return data;
  }

  import (data) {
    let value;
    const object = this.export();
    for (var key in object) {
      value = object[key];
      if (!data.hasOwnProperty(key)) {
        this.del(key);
      }
    }
    for (key in data) {
      value = data[key];
      if (this.PREFERENCE_KEYS.indexOf(key) !== -1) {
        this.set(key, value);
      }
    }
  }

  reset() {
    this.store.reset();
    this.cache = {};
  }
}
app.Settings.initClass();
