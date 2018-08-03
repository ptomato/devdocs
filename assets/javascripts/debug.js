/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS203: Remove `|| {}` from converted for-own loops
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * DS209: Avoid top-level return
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
if (!(typeof console !== 'undefined' && console !== null ? console.time : undefined) || !console.groupCollapsed) {
  return;
}

//
// App
//

const _init = app.init;
app.init = function () {
  console.time('Init');
  _init.call(app);
  console.timeEnd('Init');
  return console.time('Load');
};

const _start = app.start;
app.start = function () {
  console.timeEnd('Load');
  console.time('Start');
  _start.call(app, ...arguments);
  return console.timeEnd('Start');
};

//
// Searcher
//
app.Searcher = class Searcher extends app.Searcher {
  constructor() {
    super(arguments);
  }

  setup() {
    console.groupCollapsed(`Search: ${this.query}`);
    console.time('Total');
    return super.setup();
  }

  match() {
    if (this.matcher) {
      console.timeEnd(this.matcher.name);
    }
    return super.match();
  }

  setupMatcher() {
    console.time(this.matcher.name);
    return super.setupMatcher();
  }

  end() {
    console.log(`Results: ${this.totalResults}`);
    console.timeEnd('Total');
    console.groupEnd();
    return super.end();
  }

  kill() {
    if (this.timeout) {
      if (this.matcher) {
        console.timeEnd(this.matcher.name);
      }
      console.groupEnd();
      console.timeEnd('Total');
      console.warn('Killed');
    }
    return super.kill();
  }
};

//
// View tree
//

this.viewTree = function (view, level, visited) {
  if (view == null) {
    view = app.document;
  }
  if (level == null) {
    level = 0;
  }
  if (visited == null) {
    visited = [];
  }
  if (visited.indexOf(view) >= 0) {
    return;
  }
  visited.push(view);

  console.log(`%c ${Array(level + 1).join('  ')}${view.constructor.name}: ${!!view.activated}`,
    `color:${(view.activated && 'green') || 'red'}`);

  for (let key of Object.keys(view || {})) {
    const value = view[key];
    if ((key !== 'view') && value) {
      if ((typeof value === 'object') && value.setupElement) {
        this.viewTree(value, level + 1, visited);
      } else if (value.constructor.toString().match(/Object\(\)/)) {
        for (let k of Object.keys(value || {})) {
          const v = value[k];
          if (v && (typeof v === 'object') && v.setupElement) {
            this.viewTree(v, level + 1, visited);
          }
        }
      }
    }
  }
};
