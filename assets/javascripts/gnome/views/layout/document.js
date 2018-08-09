{
  const SUPER_setTitle = app.views.Document.prototype.setTitle;

  app.views.Document.prototype.setTitle = function(title) {
    SUPER_setTitle.call(this, title ? `${title} — GJS Docs` : 'GJS Docs');
  }
}
