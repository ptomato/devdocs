app.AppCache = class AppCache {
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
};
$.extend(app.AppCache.prototype, Events);
