import type { ActualVehicleEquipment } from "./actualVehicleEquipment"
import { serializeElements } from "./general"
import type { SpotColumnRef } from "./spotColumn"
import { Centroid as GeneralCentroid } from './centroid'
import type { SpotRowRef } from "./spotRow"

export class PassengerSpot {
  attr_id: string
  attr_version: string
  Label: string | undefined
  Orientation: 'backwards' | 'forwards' | 'leftwards' | 'rightwards' | undefined
  actualVehicleEquipments: ActualVehicleEquipment[]
  SpotColumnRef: SpotColumnRef
  SpotRowRef: SpotRowRef
  ByWindow: boolean
  ByAisle: boolean
  HasPower: boolean
  Centroid: GeneralCentroid | undefined

  constructor({ attr_id, attr_version, Label, Orientation, actualVehicleEquipments, SpotColumnRef, SpotRowRef, ByWindow, ByAisle, HasPower, Centroid }: {
   attr_id: string,
   attr_version: string,
   Label: string | undefined,
   Orientation: 'backwards' | 'forwards'| 'leftwards' | 'rightwards'  | undefined,
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   actualVehicleEquipments: any[],
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   SpotColumnRef: any,
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   SpotRowRef: any,
   ByWindow: boolean,
   ByAisle: boolean,
   HasPower: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Centroid: any | undefined}) {
    this.attr_id = attr_id
    this.attr_version = attr_version
    this.Label = Label
    this.Orientation = Orientation
    this.actualVehicleEquipments = actualVehicleEquipments
    this.SpotColumnRef = SpotColumnRef
    this.SpotRowRef = SpotRowRef
    this.ByWindow = ByWindow
    this.ByAisle = ByAisle
    this.HasPower = HasPower
    this.Centroid = Centroid ? new GeneralCentroid(Centroid) : undefined
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
        ByWindow: this.ByWindow,
        ByAisle: this.ByAisle,
        HasPower: this.HasPower,
        Centroid: this.Centroid?.toXML()
    }
  }
}

export class PassengerSpotRef {
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

