app.Model = class Model {
  constructor(attributes) {
    for (let key in attributes) { const value = attributes[key]; this[key] = value; }
  }
};
