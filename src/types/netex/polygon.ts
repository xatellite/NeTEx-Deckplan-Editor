export class Polygon {
  value: object

  constructor(value: object) {
    this.value = value
  }

  toXML() {
    return this.value
  }
}
