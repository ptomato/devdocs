#= require views/pages/base

class app.views.GirPage extends app.views.BasePage
  afterRender: ->
    @highlightCode @findAll('pre[data-mime="text/x-csrc"]'), 'c'
    return
