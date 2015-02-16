//= require ../../../views/pages/base

app.views.GirPage = class GirPage extends app.views.BasePage {
  afterRender() {
    this.highlightCode(this.findAll('pre[data-mime="text/x-csrc"]'), 'c');
  }
};
