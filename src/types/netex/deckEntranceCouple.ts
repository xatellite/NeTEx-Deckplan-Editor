import { PassengerEntranceRef } from "./passengerEntrance";

export class DeckEntranceCouple {
  attr_ref: string
  attr_version: string
  FromDeckEntranceRef: PassengerEntranceRef
  ToDeckEntranceRef: PassengerEntranceRef

  constructor({ attr_ref, attr_version, FromDeckEntranceRef, ToDeckEntranceRef}:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { attr_ref: string; attr_version: string, FromDeckEntranceRef: any, ToDeckEntranceRef: any}) {
    this.attr_ref = attr_ref
    this.attr_version = attr_version
    this.FromDeckEntranceRef = new PassengerEntranceRef(FromDeckEntranceRef)
    this.ToDeckEntranceRef = new PassengerEntranceRef(ToDeckEntranceRef)
  }

  toXML() {
    return {
      attr_ref: this.attr_ref,
      attr_version: this.attr_version,
      FromDeckEntranceRef: this.FromDeckEntranceRef.toXML(),
      ToDeckEntranceRef: this.ToDeckEntranceRef.toXML(),
    }
  }
}
