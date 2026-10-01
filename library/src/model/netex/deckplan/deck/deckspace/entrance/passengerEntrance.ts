import { ActualVehicleEquipment } from '../../../../actualVehicleEquipment'
import { Centroid as GeneralCentroid } from '../../../../centroid'
import { extractElementList, serializeElements } from '../../../../general'

export class PassengerEntrance {
  static xmlTagName = 'PassengerEntrance'

  attr_id: string
  attr_version: string
  Name: string | undefined
  Label: string | undefined
  Width: number | undefined
  Height: number | undefined
  actualVehicleEquipments: ActualVehicleEquipment[]
  PublicUse: boolean | undefined
  VehicleSide: 'rightSide' | 'leftSide' | 'front' | 'back' | undefined
  SequenceFromFront: number | undefined
  HeightFromGround: number | undefined
  DeckEntranceType: 'external' | 'internal' | undefined
  IsEmergencyExit: boolean | undefined
  HasDoor: boolean | undefined
  IsAutomatic: boolean | undefined
  Centroid: GeneralCentroid | undefined
  //   sensorInEntrance: SensorInEntrance[]

  constructor({
    attr_id,
    attr_version,
    Name,
    Label,
    Width,
    Height,
    actualVehicleEquipments,
    PublicUse,
    VehicleSide,
    SequenceFromFront,
    HeightFromGround,
    DeckEntranceType,
    IsEmergencyExit,
    HasDoor,
    IsAutomatic,
    Centroid = undefined,
    // sensorInEntrance,
  }: {
    attr_id: string
    attr_version: string
    Name: string
    Label: string | undefined
    Width: number | undefined
    Height: number | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actualVehicleEquipments: { ActualVehicleEquipment: any[] }
    PublicUse: boolean | undefined
    VehicleSide: 'rightSide' | 'leftSide' | 'front' | 'back' | undefined
    SequenceFromFront: number | undefined
    HeightFromGround: number | undefined
    DeckEntranceType: 'external' | 'internal' | undefined
    IsEmergencyExit: boolean | undefined
    HasDoor: boolean | undefined
    IsAutomatic: boolean | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Centroid: any | undefined
    // sensorInEntrance: { SensorInEntrance: any[] }
  }) {
    this.attr_id = attr_id
    this.attr_version = attr_version
    this.Name = Name
    this.Label = Label
    this.Width = Width
    this.Height = Height
    this.actualVehicleEquipments = extractElementList(
      actualVehicleEquipments?.ActualVehicleEquipment,
      ActualVehicleEquipment,
    )
    this.PublicUse = PublicUse
    this.VehicleSide = VehicleSide
    this.SequenceFromFront = SequenceFromFront
    this.HeightFromGround = HeightFromGround
    this.DeckEntranceType = DeckEntranceType
    this.IsEmergencyExit = IsEmergencyExit
    this.HasDoor = HasDoor
    this.IsAutomatic = IsAutomatic
    this.Centroid = Centroid ? GeneralCentroid.fromXML(Centroid) : undefined
    // this.sensorInEntrance = extractElementList(sensorInEntrance?.SensorInEntrance, SensorInEntrance)
  }

  toXML() {
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      Name: this.Name,
      Label: this.Label,
      Width: this.Width,
      Height: this.Height,
      actualVehicleEquipments: {
        ActualVehicleEquipment: serializeElements(this.actualVehicleEquipments),
      },
      PublicUse: this.PublicUse,
      VehicleSide: this.VehicleSide,
      SequenceFromFront: this.SequenceFromFront,
      HeightFromGround: this.HeightFromGround,
      DeckEntranceType: this.DeckEntranceType,
      IsEmergencyExit: this.IsEmergencyExit,
      HasDoor: this.HasDoor,
      IsAutomatic: this.IsAutomatic,
      Centroid: this.Centroid?.toXML(),
      //   sensorInEntrance: {SensorInEntrance: serializeElements(this.sensorInEntrance)},
    }
  }

  getShape(scale: number, deckLength: number, deckWidth: number) {
    const openingWidth = (this.Width || 0.8) * scale
    const thickness = 0.2 * scale // 20cm thickness

    let width = openingWidth
    let height = thickness

    // Default position if not set
    let x = 0
    let y = 0

    // Swap dimensions for front/back
    if (this.VehicleSide === 'front' || this.VehicleSide === 'back') {
      width = thickness
      height = openingWidth
    }

    if (this.Centroid) {
      let x = (this.Centroid?.x ?? 0) * scale
      let y = (this.Centroid?.y ?? 0) * scale

      if (this.VehicleSide === 'leftSide' || this.VehicleSide === 'rightSide') {
        y = (this.Centroid?.y ?? 0) * scale - height / 2
      } else if (this.VehicleSide === 'front' || this.VehicleSide === 'back') {
        x = (this.Centroid?.x ?? 0) * scale - width / 2
      }

      return {
        x,
        y,
        width,
        height,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
      }
    }

    // ToDo: Use Centroid here
    if (this.VehicleSide === 'leftSide') {
      x = (this.SequenceFromFront ?? 0) * scale - width / 2 + 5
      y = 5 // Top edge
    } else if (this.VehicleSide === 'rightSide') {
      x = (this.SequenceFromFront ?? 0) * scale - width / 2 + 5
      y = deckWidth * scale + 5 - height // Bottom edge
    } else if (this.VehicleSide === 'front') {
      x = 5
      y = (deckWidth * scale) / 2 + 5 - height / 2 // Center Y
    } else if (this.VehicleSide === 'back') {
      x = deckLength * scale + 5 - width
      y = (deckWidth * scale) / 2 + 5 - height / 2 // Center Y
    } else {
      // Default to top-left or somewhere visible
      x = 5
      y = 5
    }

    return {
      x,
      y,
      width,
      height,
      fill: 'orange',
      stroke: 'darkorange',
      strokeWidth: 2,
      draggable: true,
    }
  }
}

export class PassengerEntranceRef {
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
