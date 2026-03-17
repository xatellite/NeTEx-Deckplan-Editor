import { serializeElements } from '../../../../general'
import { LocatableSpot } from './locatableSpot'

export class LuggageSpot extends LocatableSpot {
  constructor({
    attr_id,
    attr_version,
    Label,
    Orientation,
    actualVehicleEquipments,
    SpotColumnRef,
    SpotRowRef,
  }: {
    attr_id: string
    attr_version: string
    Label: string | undefined
    Orientation: 'backwards' | 'forwards' | 'leftwards' | 'rightwards' | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actualVehicleEquipments: any[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpotColumnRef: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpotRowRef: any
  }) {
    super({
      attr_id,
      attr_version,
      Label,
      Orientation,
      actualVehicleEquipments,
      SpotColumnRef,
      SpotRowRef,
    })
  }

  toXML() {
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      Label: this.Label,
      Orientation: this.Orientation,
      actualVehicleEquipments: {
        ActualVehicleEquipment: serializeElements(this.actualVehicleEquipments),
      },
      SpotColumnRef: this.SpotColumnRef?.toXML(),
      SpotRowRef: this.SpotRowRef?.toXML(),
    }
  }
}

export class LuggageSpotRef {
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
