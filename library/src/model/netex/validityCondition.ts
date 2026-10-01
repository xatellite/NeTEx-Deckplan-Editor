export class ValidityCondition {
  attr_id: string
  attr_version: string
  Name: string

  constructor({ attr_id, attr_version, Name }: { attr_id: string; attr_version: string; Name: string }) {
    this.attr_id = attr_id
    this.attr_version = attr_version
    this.Name = Name
  }

  toXML() {
    return {
      attr_id: this.attr_id,
      Name: this.Name,
      attr_version: this.attr_version,
    }
  }
}

export class ValidityConditionRef {
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