import type { ActualVehicleEquipment } from "./actualVehicleEquipment"
import { serializeElements } from "./general"
import type { SpotColumnRef } from "./spotColumn"
import type { SpotRowRef } from "./spotRow"

export class LuggageSpot {
  attr_id: string
  attr_version: string
  Label: string | undefined
  Orientation: 'backwards' | 'forwards'| 'leftwards' | 'rightwards'  | undefined
  actualVehicleEquipments: ActualVehicleEquipment[]
  SpotColumnRef: SpotColumnRef
  SpotRowRef: SpotRowRef

  constructor({ attr_id, attr_version, Label, Orientation, actualVehicleEquipments, SpotColumnRef, SpotRowRef }: {
   attr_id: string,
   attr_version: string,
   Label: string | undefined,
   Orientation: 'backwards' | 'forwards' | 'leftwards' | 'rightwards' | undefined,
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   actualVehicleEquipments: any[],
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   SpotColumnRef: any,
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   SpotRowRef: any,
    }) {
    this.attr_id = attr_id
    this.attr_version = attr_version
    this.Label = Label
    this.Orientation = Orientation
    this.actualVehicleEquipments = actualVehicleEquipments
    this.SpotColumnRef = SpotColumnRef
    this.SpotRowRef = SpotRowRef
  }

  toXML() {
    return {
        attr_id: this.attr_id,
        attr_version: this.attr_version,
        Label: this.Label,
        Orientation: this.Orientation,
        actualVehicleEquipments: {ActualVehicleEquipment: serializeElements(this.actualVehicleEquipments)},
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
      attr_version: this.attr_version
    }
  }
}

