$.extendTemplate('sidebarEntry', function (parent, entry) {
  // Only alter GIR docs
  if (entry.doc.type === 'gir') {
    // If the type of the entry has an identical name, it has been redirected so we can hide it.
    if (entry.type === entry.name) {
      return '';
    }

    let iconClass = "_prog-icon";

    if (entry.name.endsWith("()") || entry.name.startsWith("vfunc")) {
      iconClass += " _prog-function-icon"
    } else if (entry.name.startsWith("::")) {
      iconClass += " _prog-signal-icon"
    } else {
      iconClass += " _prog-property-icon"
    }

    return `<a href="${entry.fullPath()}" class="_list-item _list-item-no-children _list-hover ${iconClass}" tabindex="-1">${$.escape(entry.name)}</a>`;
  }

  return parent.call(this, entry);
});
