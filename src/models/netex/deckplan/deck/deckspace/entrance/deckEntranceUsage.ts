import { serializeElementsAndRefs } from "../../../../general"
import { ValidityCondition, ValidityConditionRef } from "../../../../validityCondition"

export class DeckEntranceUsage {
  attr_ref: string
  attr_version: string
  validityConditions: (ValidityCondition | ValidityConditionRef)[]
  Name: string
  EntranceUsageType: "exit" | "entrance" | undefined
  EntranceSetting: "shut" | "open" | undefined
  ControlledLocking: boolean

  constructor({ attr_ref, attr_version, validityConditions, Name, EntranceUsageType, EntranceSetting , ControlledLocking}:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { attr_ref: string; attr_version: string, validityConditions:{ ValidityConditionRef: any[]; ValidityCondition: any[] }, Name: string
  EntranceUsageType: "exit" | "entrance" | undefined
  EntranceSetting: "shut" | "open" | undefined
  ControlledLocking: boolean }) {
    this.attr_ref = attr_ref
    this.attr_version = attr_version
    this.validityConditions = Object.entries(validityConditions).flatMap(([k, d]) => {
          if (k === 'ValidityConditionRef') {
            d.map((vc) => new ValidityConditionRef(vc))
          }
          if (k === 'ValidityCondition') {
            d.map((vc) => new ValidityCondition(vc))
          }
          return []
        })
    this.Name = Name
    this.EntranceUsageType = EntranceUsageType
    this.EntranceSetting = EntranceSetting
    this.ControlledLocking = ControlledLocking
  }

  toXML() {
    return {
      attr_ref: this.attr_ref,
      attr_version: this.attr_version,
      validityConditions: serializeElementsAndRefs(this.validityConditions),
      Name: this.Name,
      EntranceUsageType: this.EntranceUsageType,
      EntranceSetting: this.EntranceSetting,
      ControlledLocking: this.ControlledLocking,
    }
  }
}
