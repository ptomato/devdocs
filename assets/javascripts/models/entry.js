//= require app/searcher

(function () {
  let applyAliases = undefined;
  const Cls = (app.models.Entry = class Entry extends app.Model {
    static initClass() {

      let ALIASES;
      applyAliases = function (string) {
        if (ALIASES.hasOwnProperty(string)) {
          return [string, ALIASES[string]];
        } else {
          const words = string.split('.');
          for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (ALIASES.hasOwnProperty(word)) {
              words[i] = ALIASES[word];
              return [string, words.join('.')];
            }
          }
        }
        return string;
      };

      this.ALIASES = (ALIASES = {
        'angular': 'ng',
        'angular.js': 'ng',
        'backbone.js': 'bb',
        'c++': 'cpp',
        'coffeescript': 'cs',
        'crystal': 'cr',
        'elixir': 'ex',
        'javascript': 'js',
        'jquery': '$',
        'knockout.js': 'ko',
        'less': 'ls',
        'lodash': '_',
        'marionette': 'mn',
        'markdown': 'md',
        'modernizr': 'mdr',
        'moment.js': 'mt',
        'openjdk': 'java',
        'nginx': 'ngx',
        'numpy': 'np',
        'pandas': 'pd',
        'postgresql': 'pg',
        'python': 'py',
        'ruby.on.rails': 'ror',
        'ruby': 'rb',
        'rust': 'rs',
        'sass': 'scss',
        'tensorflow': 'tf',
        'typescript': 'ts',
        'underscore.js': '_'
      });
    }
    // Attributes: name, type, path

    constructor() {
      super(...arguments);
      this.text = applyAliases(app.Searcher.normalizeString(this.name));
    }

    addAlias(name) {
      const text = applyAliases(app.Searcher.normalizeString(name));
      if (!Array.isArray(this.text)) {
        this.text = [this.text];
      }
      this.text.push(Array.isArray(text) ? text[1] : text);
    }

    fullPath() {
      return this.doc.fullPath(this.isIndex() ? '' : this.path);
    }

    dbPath() {
      return this.path.replace(/#.*/, '');
    }

    filePath() {
      return this.doc.fullPath(this._filePath());
    }

    fileUrl() {
      return this.doc.fileUrl(this._filePath());
    }

    _filePath() {
      let result = this.path.replace(/#.*/, '');
      if (result.slice(-5) !== '.html') {
        result += '.html';
      }
      return result;
    }

    isIndex() {
      return this.path === 'index';
    }

    getType() {
      return this.doc.types.findBy('name', this.type);
    }

    loadFile(onSuccess, onError) {
      return app.db.load(this, onSuccess, onError);
    }
  });
  Cls.initClass();
  return Cls;
})();
