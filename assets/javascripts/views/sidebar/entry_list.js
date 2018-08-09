//= require views/list/paginated_list

app.views.EntryList = class EntryList extends app.views.PaginatedList {
  static initClass() {
    this.tagName = 'div';
    this.className = '_list _list-sub';
  }

  constructor(entries) {
    super(...arguments);
    this.entries = entries;

    this.renderPaginated();
    this.activate();
  }

  render(entries) {
    return this.tmpl('sidebarEntry', entries);
  }
};
app.views.EntryList.initClass();
