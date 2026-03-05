export class EquipmentRef {
  attr_ref: string
  attr_version: string

  constructor({ attr_ref, attr_version }: { attr_ref: string; attr_version: string }) {
    this.attr_ref = attr_ref
    this.attr_version = attr_version
  }

  toXML() {
    return {
      attr_ref: this.attr_ref,
      attr_version: this.attr_version,
    }
  }
}
