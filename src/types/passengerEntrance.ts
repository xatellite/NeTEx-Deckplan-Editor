import { ActualVehicleEquipment } from './actualVehicleEquipment'
import { extractElementList, Name as GeneralName, serializeElements } from './general'

export class PassengerEntrance {
  attr_id: string
  attr_version: string
  Name: GeneralName | undefined
  Label: string | undefined
  Width: number | undefined
  Height: number | undefined
  actualVehicleEquipments: ActualVehicleEquipment[]
  PublicUse: boolean
  VehicleSide: 'rightSide' | 'leftSide' | 'front' | 'back' | undefined
  SequenceFromFront: number
  HeightFromGround: number
  DeckEntranceType: 'external' | 'internal'
  IsEmergencyExit: boolean
  HasDoor: boolean
  IsAutomatic: boolean
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
    // sensorInEntrance,
  }: {
    attr_id: string
    attr_version: string
    Name: string
    Label: string
    Width: number
    Height: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actualVehicleEquipments: { ActualVehicleEquipment: any[] }
    PublicUse: boolean
    VehicleSide: 'rightSide' | 'leftSide' | 'front' | 'back' | undefined
    SequenceFromFront: number
    HeightFromGround: number
    DeckEntranceType: 'external' | 'internal'
    IsEmergencyExit: boolean
    HasDoor: boolean
    IsAutomatic: boolean
    // sensorInEntrance: { SensorInEntrance: any[] }
  }) {
    this.attr_id = attr_id
    this.attr_version = attr_version
    this.Name = Name ? new GeneralName(Name) : undefined
    this.Label = Label
    this.Width = Width
    this.Height = Height
    this.actualVehicleEquipments =  extractElementList(actualVehicleEquipments?.ActualVehicleEquipment, ActualVehicleEquipment)
    this.PublicUse = PublicUse
    this.VehicleSide = VehicleSide
    this.SequenceFromFront = SequenceFromFront
    this.HeightFromGround = HeightFromGround
    this.DeckEntranceType = DeckEntranceType
    this.IsEmergencyExit = IsEmergencyExit
    this.HasDoor = HasDoor
    this.IsAutomatic = IsAutomatic
    // this.sensorInEntrance = extractElementList(sensorInEntrance?.SensorInEntrance, SensorInEntrance)
  }


  toXML() {
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      Name: this.Name?.toXML(),
      Label: this.Label,
      Width: this.Width,
      Height: this.Height,
      actualVehicleEquipments: {ActualVehicleEquipment: serializeElements(this.actualVehicleEquipments)},
      PublicUse: this.PublicUse,
      VehicleSide: this.VehicleSide,
      SequenceFromFront: this.SequenceFromFront,
      HeightFromGround: this.HeightFromGround,
      DeckEntranceType: this.DeckEntranceType,
      IsEmergencyExit: this.IsEmergencyExit,
      HasDoor: this.HasDoor,
      IsAutomatic: this.IsAutomatic,
    //   sensorInEntrance: {SensorInEntrance: serializeElements(this.sensorInEntrance)},
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
      attr_version: this.attr_version
    }
  }
}
