import { Name } from './general'

export abstract class Equipment {
  attr_id: string
  attr_version: string
  Name?: string
  Description?: string

  constructor(data: any) {
    this.attr_id = data.attr_id || `equipment_${Date.now()}`
    this.attr_version = data.attr_version || '1.0'
    this.Name = data.Name?.text_value || data.Name
    this.Description = data.Description?.text_value || data.Description
  }

  toXML(): any {
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      Name: this.Name ? { text_value: this.Name } : undefined,
      Description: this.Description ? { text_value: this.Description } : undefined,
    }
  }
}

export abstract class InstalledEquipment extends Equipment {
  constructor(data: any) {
    super(data)
  }
}

export abstract class PassengerEquipment extends InstalledEquipment {
  Fixed?: boolean

  constructor(data: any) {
    super(data)
    this.Fixed = data.Fixed === 'true' || data.Fixed === true
  }

  toXML() {
    return {
      ...super.toXML(),
      Fixed: this.Fixed,
    }
  }
}

export class AccessVehicleEquipment extends PassengerEquipment {
  static xmlTagName = 'AccessVehicleEquipment'
  LowFloor?: boolean
  HighFloor?: boolean
  Ramp?: boolean

  constructor(data: any) {
    super(data)
    this.LowFloor = data.LowFloor === 'true' || data.LowFloor === true
    this.HighFloor = data.HighFloor === 'true' || data.HighFloor === true
    this.Ramp = data.Ramp === 'true' || data.Ramp === true
  }

  toXML() {
    return {
      ...super.toXML(),
      LowFloor: this.LowFloor,
      HighFloor: this.HighFloor,
      Ramp: this.Ramp,
    }
  }
}

export class SanitaryEquipment extends PassengerEquipment {
  static xmlTagName = 'SanitaryEquipment'
  // Add relevant fields if known, or leave generic
  constructor(data: any) {
    super(data)
  }
}

export class SeatingEquipment extends InstalledEquipment {
  static xmlTagName = 'SeatingEquipment'
  // Not a child of PassengerEquipment as per user feedback
  constructor(data: any) {
    super(data)
  }
}
