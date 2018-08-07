app.models.Type = class Type extends app.models.Type {
  // Redirect to the first Entry if the Type and first Entry share the same name.
  // This means the index Gtk.Menu redirects to the entry Gtk.Menu

  fullPath() {
    let path = super.fullPath();

    if (this.doc && this.doc.type === 'gir') {
      const entries = this.entries();

      if (entries && entries.length > 0) {
        const firstEntry = entries[0];

        if (this.name === firstEntry.name) {
          path = firstEntry.fullPath();
        } else {
          let found = entries.find(value => this.name === value.name);

          if (found) {
            path = found.fullPath();
          }
        }
      }
    }

    return path;
  }
}
