/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Cls = (app.collections.Entries = class Entries extends app.Collection {
  static initClass() {
    this.model = 'Entry';
  }
});
Cls.initClass();
