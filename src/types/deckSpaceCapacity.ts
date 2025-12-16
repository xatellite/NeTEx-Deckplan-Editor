export class DeckSpaceCapacity {
  attr_ref: string
  attr_version: string
  LocatableSpotType: 'seat' | undefined
  capacity: number

  constructor({ attr_ref, attr_version, LocatableSpotType, capacity }: { attr_ref: string; attr_version: string, LocatableSpotType: 'seat' | undefined, capacity: number }) {
    this.attr_ref = attr_ref
    this.attr_version = attr_version
    this.LocatableSpotType = LocatableSpotType
    this.capacity = capacity
  }

  toXML() {
    return {
      attr_ref: this.attr_ref,
      attr_version: this.attr_version,
      LocatableSpotType: this.LocatableSpotType,
      capacity: this.capacity
    }
  }
}
