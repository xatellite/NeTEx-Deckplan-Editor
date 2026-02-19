export class SpotRow {
  attr_id: string
  label: string //GeneralLabel[]

  constructor({ attr_id, Label }: { attr_id: string; Label: string }) {
    this.attr_id = attr_id
    this.label = Label //.map((l) => new GeneralLabel(l))
  }

  toXML() {
    return {
      attr_id: this.attr_id,
      label: this.label
    }
  }
}

export class SpotRowRef {
  attr_ref: string
  attr_version: string

  constructor({ attr_ref, attr_version }: { attr_ref: string; attr_version: string }) {
    this.attr_ref = attr_ref
    this.attr_version = attr_version
  }

  toXML() {
    return {
      attr_ref: this.attr_ref,
      attr_version: this.attr_version
    }
  }
}