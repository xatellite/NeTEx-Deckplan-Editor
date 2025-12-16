import { ActualVehicleEquipment } from "./actualVehicleEquipment"
import { extractElementList, serializeElements, serializeElementsAndRefs } from "./general"
import { SpotColumnRef as GeneralSpotColumnRef } from "./spotColumn"
import { Centroid as GeneralCentroid } from './centroid'
import { SpotRowRef as GeneralSpotRowRef } from "./spotRow"

export class PassengerSpot {
  attr_id: string
  attr_version: string
  Label: string | undefined
  Orientation: 'backwards' | 'forwards' | 'leftwards' | 'rightwards' | undefined
  actualVehicleEquipments: ActualVehicleEquipment[] | undefined
  SpotColumnRef: GeneralSpotColumnRef | undefined
  SpotRowRef: GeneralSpotRowRef | undefined
  ByWindow: boolean
  ByAisle: boolean
  HasPower: boolean
  Centroid: GeneralCentroid | undefined
  Width: number
  Length: number

  constructor({ attr_id, attr_version, Label, Orientation, actualVehicleEquipments, SpotColumnRef, SpotRowRef, ByWindow, ByAisle, HasPower, Centroid, Width, Length }: {
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
    Centroid: any | undefined
    Width: number | undefined
    Length: number | undefined
  }) {
    this.attr_id = attr_id
    this.attr_version = attr_version
    this.Label = Label
    this.Orientation = Orientation
    this.actualVehicleEquipments = actualVehicleEquipments ? extractElementList(actualVehicleEquipments, ActualVehicleEquipment) : undefined
    this.SpotColumnRef = SpotColumnRef ? new GeneralSpotColumnRef(SpotColumnRef) : undefined
    this.SpotRowRef = SpotRowRef ? new GeneralSpotRowRef(SpotRowRef) : undefined
    this.ByWindow = ByWindow
    this.ByAisle = ByAisle
    this.HasPower = HasPower
    this.Centroid = Centroid ? GeneralCentroid.fromXML(Centroid) : undefined
    this.Width = Width || 0.5
    this.Length = Length || 0.5
  }

  toXML() {
    return {
        attr_id: this.attr_id,
        attr_version: this.attr_version,
        Label: this.Label,
        Orientation: this.Orientation,
        actualVehicleEquipments: this.actualVehicleEquipments ? serializeElementsAndRefs(this.actualVehicleEquipments) : undefined,
        SpotColumnRef: this.SpotColumnRef?.toXML(),
        SpotRowRef: this.SpotRowRef?.toXML(),
        ByWindow: this.ByWindow,
        ByAisle: this.ByAisle,
        HasPower: this.HasPower,
        Centroid: this.Centroid?.toXML(),
        Width: this.Width,
        Length: this.Length,
    }
  }

  getShape(scale: number) {
    if (this.Centroid) {
      const width = this.Width * scale
      const height = this.Length * scale
      return {
        x: ((this.Centroid?.x ?? 1) * scale - width / 2 ) + 5,
        y: ((this.Centroid?.y ?? 1) * scale - height / 2 ) + 5,
        width,
        height,
        fill: 'lightgray',
        stroke: 'gray',
        strokeWidth: 1,
        cornerRadius: 2,
        draggable: true,
      }
    }
    return {
      x: 0,
      y: 0,
      width: this.Width * scale,
      height: this.Length * scale,
      fill: 'red',
      draggable: true,
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

