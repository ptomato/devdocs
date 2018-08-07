$.extendTemplate('sidebarEntry', function (parent, entry) {
  // Only alter GIR docs
  if (entry.doc && entry.doc.type === 'gir') {
    // If the type of the entry has an identical name, it has been redirected so we can hide it.
    if (entry.type === entry.name) {
      return '';
    }

    let iconClass = "_prog-icon";

    let pathParts = entry.path.split('#');
    let type = pathParts.length > 1 ? pathParts[1] : pathParts[0];
    let isFunction = [
      'constructor-',
      'function-',
      'method-',
      'vfunc-'
    ].some(value => type.startsWith(value));

    if (isFunction) {
      iconClass += ` _prog-function-icon`;
    } else if (type.startsWith('signal-')) {
      iconClass += ` _prog-signal-icon`;
    } else if (type.startsWith('property-')) {
      iconClass += ` _prog-property-icon`;
    } else {
      iconClass += ` _prog-data-icon`;
    }

    return `<a href="${entry.fullPath()}" class="_list-item _list-item-no-children _list-hover ${iconClass}" tabindex="-1">${$.escape(entry.name)}</a>`;
  }

  return parent.call(this, entry);
});
