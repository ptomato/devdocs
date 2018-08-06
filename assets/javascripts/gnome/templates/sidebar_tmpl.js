$.extendTemplate('sidebarEntry', function (parent, entry) {
  // If the type of the entry has an identical name, it has been redirected so we can hide it.

  if (entry.type === entry.name) {
    return '';
  }

  return parent.call(this, entry);
});
