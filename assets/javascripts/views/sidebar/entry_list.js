/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
//= require views/list/paginated_list

const Cls = (app.views.EntryList = class EntryList extends app.views.PaginatedList {
  static initClass() {
    this.tagName = 'div';
    this.className = '_list _list-sub';
  }

  constructor(entries) { {     // Hack: trick Babel/TypeScript into allowing this before super.
    if (false) { super(); }     let thisFn = (() => { return this; }).toString();     let thisName = thisFn.slice(thisFn.indexOf('return') + 6 + 1, thisFn.indexOf(';')).trim();     eval(`${thisName} = this;`);   }   this.entries = entries; super(...arguments); }

  init() {
    this.renderPaginated();
    this.activate();
  }

  render(entries) {
    return this.tmpl('sidebarEntry', entries);
  }
});
Cls.initClass();
