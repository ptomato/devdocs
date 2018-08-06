$.extendFn = function (fn, extension) {
  const parentFn = fn;

  return function (...args) {
    return extension.call(this, parentFn, ...args);
  };
}

$.extendTemplate = function (templateName, extension) {
  const fn = templateName in app.templates ? app.templates[templateName] : function () {};
  app.templates[templateName] = $.extendFn(fn, extension);
}
