import { ActualVehicleEquipment } from './actualVehicleEquipment'
import { extractElementList, serializeElements, serializeElementsAndRefs } from './general'
import { SpotColumnRef as GeneralSpotColumnRef } from './spotColumn'
import { Centroid as GeneralCentroid } from './centroid'
import { SpotRowRef as GeneralSpotRowRef } from './spotRow'

export class PassengerSpot {
  static xmlTagName = 'PassengerSpot' 
  
  attr_id: string
  attr_version: string
  Label: string | undefined
  Orientation: 'backwards' | 'forwards' | 'leftwards' | 'rightwards' | undefined
  actualVehicleEquipments: ActualVehicleEquipment[] | undefined
  SpotColumnRef: GeneralSpotColumnRef | undefined
  SpotRowRef: GeneralSpotRowRef | undefined
  ByWindow: boolean | undefined
  ByAisle: boolean | undefined
  HasPower: boolean | undefined
  Centroid: GeneralCentroid | undefined
  Width: number
  Length: number

  constructor({
    attr_id,
    attr_version,
    Label,
    Orientation,
    actualVehicleEquipments,
    SpotColumnRef,
    SpotRowRef,
    ByWindow,
    ByAisle,
    HasPower,
    Centroid,
    Width,
    Length,
  }: {
    attr_id: string
    attr_version: string
    Label: { text_value: string } | undefined
    Orientation: { text_value: 'backwards' | 'forwards' | 'leftwards' | 'rightwards' } | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actualVehicleEquipments: any[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpotColumnRef: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpotRowRef: any
    ByWindow: { text_value: boolean } | undefined
    ByAisle: { text_value: boolean } | undefined
    HasPower: { text_value: boolean } | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Centroid: any | undefined
    Width: { text_value: number } | undefined
    Length: { text_value: number } | undefined
  }) {
    this.attr_id = attr_id
    this.attr_version = attr_version
    this.Label = Label ? Label['text_value'] : undefined
    this.Orientation = Orientation ? Orientation['text_value'] : undefined
    this.actualVehicleEquipments = actualVehicleEquipments
      ? extractElementList(actualVehicleEquipments, ActualVehicleEquipment)
      : undefined
    this.SpotColumnRef = SpotColumnRef ? new GeneralSpotColumnRef(SpotColumnRef) : undefined
    this.SpotRowRef = SpotRowRef ? new GeneralSpotRowRef(SpotRowRef) : undefined
    this.ByWindow = ByWindow?.text_value
    this.ByAisle = ByAisle?.text_value
    this.HasPower = HasPower?.text_value
    this.Centroid = Centroid ? GeneralCentroid.fromXML(Centroid) : undefined
    this.Width = Width?.text_value || 0.5
    this.Length = Length?.text_value || 0.5
  }

  toXML() {
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      Label: this.Label ? { text_value: this.Label } : undefined,
      Orientation: this.Orientation ? { text_value: this.Orientation } : undefined,
      actualVehicleEquipments: this.actualVehicleEquipments
        ? serializeElementsAndRefs(this.actualVehicleEquipments)
        : undefined,
      SpotColumnRef: this.SpotColumnRef?.toXML(),
      SpotRowRef: this.SpotRowRef?.toXML(),
      ByWindow: this.ByWindow ? { text_value: this.ByWindow } : undefined,
      ByAisle: this.ByAisle ? { text_value: this.ByAisle } : undefined,
      HasPower: this.HasPower ? { text_value: this.HasPower } : undefined,
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
        x: (this.Centroid?.x ?? 1) * scale - width / 2 + 5,
        y: (this.Centroid?.y ?? 1) * scale - height / 2 + 5,
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
      attr_version: this.attr_version,
    }
  }
}
