this.Events = {
  on(event, callback) {
    if (event.indexOf(' ') >= 0) {
      for (let name of event.split(' ')) {
        this.on(name, callback);
      }
    } else {
      let base;
      (((base = this._callbacks != null ? this._callbacks : (this._callbacks = {})))[event] != null ? base[event] : (base[event] = [])).push(callback);
    }
    return this;
  },

  off(event, callback) {
    let callbacks, index;
    if (event.indexOf(' ') >= 0) {
      for (let name of event.split(' ')) {
        this.off(name, callback);
      }
    } else if ((callbacks = this._callbacks != null ? this._callbacks[event] : undefined) && ((index = callbacks.indexOf(callback)) >= 0)) {
      callbacks.splice(index, 1);
      if (!callbacks.length) {
        delete this._callbacks[event];
      }
    }
    return this;
  },

  trigger(event, ...args) {
    let callbacks;
    this.eventInProgress = {
      name: event,
      args
    };
    if (callbacks = this._callbacks != null ? this._callbacks[event] : undefined) {
      for (let callback of callbacks.slice(0)) {
        if (typeof callback === 'function') {
          callback(...(args || []));
        }
      }
    }
    this.eventInProgress = null;
    if (event !== 'all') {
      this.trigger('all', event, ...args);
    }
    return this;
  },

  removeEvent(event) {
    if (this._callbacks != null) {
      for (let name of event.split(' ')) {
        delete this._callbacks[name];
      }
    }
    return this;
  }
};
