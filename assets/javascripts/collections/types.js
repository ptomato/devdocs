app.collections.Types = class Types extends app.Collection {
  static initClass() {
    this.model = 'Type';

    this.GUIDES_RGX = /(^|\()(guides?|tutorials?|reference|book|getting\ started|manual|examples)($|[\):])/i;
    this.APPENDIX_RGX = /appendix/i;
  }

  groups() {
    const result = [];
    for (let type of this.models) {
      var name;
      (result[name = this._groupFor(type)] || (result[name] = [])).push(type);
    }
    return result.filter(e => e.length > 0);
  }

  _groupFor(type) {
    if (Types.GUIDES_RGX.test(type.name)) {
      return 0;
    } else if (Types.APPENDIX_RGX.test(type.name)) {
      return 2;
    } else {
      return 1;
    }
  }
}
app.collections.Types.initClass();
