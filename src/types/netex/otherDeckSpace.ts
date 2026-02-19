import { ActualVehicleEquipment } from './actualVehicleEquipment'
import { extractElementList, Name as GeneralName } from './general'

export class OtherDeckSpace {
  attr_id: string
  attr_version: string
  Name: GeneralName | undefined
  PublicUse: boolean | undefined
  TotalCapacity: number | undefined
  actualVehicleEquipments: ActualVehicleEquipment[]

  constructor({
    attr_id,
    attr_version,
    Name,
    PublicUse,
    TotalCapacity,
    actualVehicleEquipments,
  }: {
    attr_id: string
    attr_version: string
    Name: { text_value: string }
    actualVehicleEquipments: { ActualVehicleEquipment: ActualVehicleEquipment[] }
    PublicUse: { text_value: boolean }
    TotalCapacity: { text_value: number }
  }) {
    this.attr_id = attr_id
    this.attr_version = attr_version
    this.Name = Name ? new GeneralName(Name) : undefined
    this.actualVehicleEquipments = actualVehicleEquipments
      ? extractElementList(actualVehicleEquipments.ActualVehicleEquipment, ActualVehicleEquipment)
      : []
    this.PublicUse = PublicUse?.text_value
    this.TotalCapacity = TotalCapacity?.text_value
  }

  toXML() {
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      Name: this.Name?.toXML,
    }
  }
}
