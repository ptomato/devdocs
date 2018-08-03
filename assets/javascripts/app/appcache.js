/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Cls = (app.AppCache = class AppCache {
  static initClass() {
    $.extend(this.prototype, Events);
  }

  static isEnabled() {
    try {
      return applicationCache && (applicationCache.status !== applicationCache.UNCACHED);
    } catch (error) {}
  }

  constructor() {
    this.onProgress = this.onProgress.bind(this);
    this.onUpdateReady = this.onUpdateReady.bind(this);
    this.cache = applicationCache;
    this.notifyUpdate = true;
    if (this.cache.status === this.cache.UPDATEREADY) {
      this.onUpdateReady();
    }

    $.on(this.cache, 'progress', this.onProgress);
    $.on(this.cache, 'updateready', this.onUpdateReady);
  }

  update() {
    this.notifyUpdate = true;
    this.notifyProgress = true;
    try {
      this.cache.update();
    } catch (error) {}
  }

  updateInBackground() {
    this.notifyUpdate = false;
    this.notifyProgress = false;
    try {
      this.cache.update();
    } catch (error) {}
  }

  reload() {
    $.on(this.cache, 'updateready noupdate error', () => window.location = '/');
    this.notifyUpdate = false;
    this.notifyProgress = true;
    try {
      this.cache.update();
    } catch (error) {}
  }

  onProgress(event) {
    if (this.notifyProgress) {
      this.trigger('progress', event);
    }
  }

  onUpdateReady() {
    if (this.notifyUpdate) {
      this.trigger('updateready');
    }
  }
});
Cls.initClass();
