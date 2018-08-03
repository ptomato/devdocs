(function () {
  let GUIDES_RGX = undefined;
  let APPENDIX_RGX = undefined;
  const Cls = (app.collections.Types = class Types extends app.Collection {
    static initClass() {
      this.model = 'Type';

      GUIDES_RGX = /(^|\()(guides?|tutorials?|reference|book|getting\ started|manual|examples)($|[\):])/i;
      APPENDIX_RGX = /appendix/i;
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
      if (GUIDES_RGX.test(type.name)) {
        return 0;
      } else if (APPENDIX_RGX.test(type.name)) {
        return 2;
      } else {
        return 1;
      }
    }
  });
  Cls.initClass();
  return Cls;
})();
