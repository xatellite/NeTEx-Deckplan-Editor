import type { EquipmentRef } from './equipment'

export class ActualVehicleEquipment {
  attr_id: string
  attr_version: string
  Units: number
  TicketingEquipmentRef: EquipmentRef | undefined
  TicketValidatorEquipmentRef: EquipmentRef | undefined

  constructor({
    attr_id,
    attr_version,
    Units,
    TicketingEquipmentRef = undefined,
    TicketValidatorEquipmentRef = undefined,
  }: {
    attr_id: string
    attr_version: string
    Units: number
    TicketingEquipmentRef: EquipmentRef | undefined
    TicketValidatorEquipmentRef: EquipmentRef | undefined
  }) {
    this.attr_id = attr_id
    this.attr_version = attr_version
    this.Units = Units
    this.TicketingEquipmentRef = TicketingEquipmentRef
    this.TicketValidatorEquipmentRef = TicketValidatorEquipmentRef
  }

  toXML() {
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      Units: this.Units,
      TicketingEquipmentRef: this.TicketingEquipmentRef?.toXML(),
      TicketValidatorEquipmentRef: this.TicketValidatorEquipmentRef?.toXML(),
    }
  }
}
