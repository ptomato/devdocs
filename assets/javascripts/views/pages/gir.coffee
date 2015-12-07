#= require views/pages/base

class app.views.GirPage extends app.views.BasePage
  afterRender: ->
    @highlightCode @findAll('pre[data-mime="text/x-csrc"], code[data-mime="text/x-csrc"]'), 'c'
    @highlightCode @findAll('pre[data-mime="application/javascript], code[data-mime="text/x-csrc"]'), 'javascript'
    return
