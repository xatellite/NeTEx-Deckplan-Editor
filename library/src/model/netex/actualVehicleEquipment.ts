import type { EquipmentRef } from './equipment.js'
import { PassengerEquipment } from './passengerEquipment.js'

export class ActualVehicleEquipment extends PassengerEquipment {
  static xmlTagName = 'ActualVehicleEquipment'
  Units: number
  TicketingEquipmentRef: EquipmentRef | undefined
  TicketValidatorEquipmentRef: EquipmentRef | undefined

  constructor(data: any) {
    super(data)
    this.Units = data.Units || 1
    this.TicketingEquipmentRef = data.TicketingEquipmentRef
    this.TicketValidatorEquipmentRef = data.TicketValidatorEquipmentRef
  }

  toXML() {
    return {
      ...super.toXML(),
      Units: this.Units,
      TicketingEquipmentRef: this.TicketingEquipmentRef?.toXML(),
      TicketValidatorEquipmentRef: this.TicketValidatorEquipmentRef?.toXML(),
    }
  }
}

