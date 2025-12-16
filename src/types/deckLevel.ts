export class DeckLevel {
  attr_id: string
  attr_version: string
  Label: string

  constructor({
    Label,
    attr_id,
    attr_version,
  }: {
    attr_id: string
    attr_version: string
    Label: string
  }) {
    this.attr_id = attr_id
    this.attr_version = attr_version
    this.Label = Label
  }

  toXML() {
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      Label: this.Label
    }
  }
}

export class DeckLevelRef {
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
