import { ActualVehicleEquipment } from '../../../actualVehicleEquipment'
import { extractElementList } from '../../../general'

export class OtherDeckSpace {
  attr_id: string
  attr_version: string
  Name: string | undefined
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
    Name: string
    actualVehicleEquipments: { ActualVehicleEquipment: ActualVehicleEquipment[] }
    PublicUse: boolean
    TotalCapacity: number
  }) {
    this.attr_id = attr_id
    this.attr_version = attr_version
    this.Name = Name
    this.actualVehicleEquipments = actualVehicleEquipments
      ? extractElementList(actualVehicleEquipments.ActualVehicleEquipment, ActualVehicleEquipment)
      : []
    this.PublicUse = PublicUse
    this.TotalCapacity = TotalCapacity
  }

  toXML() {
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      Name: this.Name,
    }
  }
}
