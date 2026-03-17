import { ActualVehicleEquipment } from '../../../../actualVehicleEquipment'
import { extractElementList } from '../../../../general'
import { SpotColumnRef as GeneralSpotColumnRef } from '../../spotColumn'
import { SpotRowRef as GeneralSpotRowRef } from '../../spotRow'

export class LocatableSpot {
  attr_id: string
  attr_version: string
  Label: string | undefined
  Orientation: 'backwards' | 'forwards' | 'leftwards' | 'rightwards' | undefined
  actualVehicleEquipments: ActualVehicleEquipment[]
  SpotColumnRef: GeneralSpotColumnRef | undefined
  SpotRowRef: GeneralSpotRowRef | undefined

  constructor({
    attr_id,
    attr_version,
    Label,
    Orientation,
    actualVehicleEquipments,
    SpotColumnRef,
    SpotRowRef,
  }: {
    attr_id: string
    attr_version: string
    Label: string | undefined
    Orientation: 'backwards' | 'forwards' | 'leftwards' | 'rightwards' | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actualVehicleEquipments: any[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpotColumnRef: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpotRowRef: any
  }) {
    this.attr_id = attr_id
    this.attr_version = attr_version
    this.Label = Label
    this.Orientation = Orientation
    this.actualVehicleEquipments = actualVehicleEquipments
      ? extractElementList(actualVehicleEquipments, ActualVehicleEquipment)
      : []
    this.SpotColumnRef = SpotColumnRef ? new GeneralSpotColumnRef(SpotColumnRef) : undefined
    this.SpotRowRef = SpotRowRef ? new GeneralSpotRowRef(SpotRowRef) : undefined
  }
}
