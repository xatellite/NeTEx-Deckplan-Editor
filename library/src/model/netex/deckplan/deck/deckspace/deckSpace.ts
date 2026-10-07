import { extractElementList } from '../../../../general'
import { GridMarker } from './gridMarker'

type CoveredType = 'indoors' | 'outdoors' | 'covered' | 'mixed' | 'unknown'
const allCoveredTypes =  ['indoors', 'outdoors', 'covered', 'mixed', 'unknown'] as CoveredType[]

export class DeckSpace {
  attr_id: string
  attr_version: string
  Covered: CoveredType
  AirConditioned: boolean
  SmokingAllowed: boolean
  TotalCapacity: number
  gridMarkers: GridMarker[]

  constructor({
    attr_id,
    attr_version,
    Covered,
    AirConditioned,
    SmokingAllowed,
    TotalCapacity,
    gridMarkers,
  }: {
    attr_id: string
    attr_version: string
    Covered: boolean | string | undefined
    AirConditioned: boolean
    SmokingAllowed: boolean
    TotalCapacity: number
    gridMarkers: { GridMarkers: GridMarker[]}
  }) {
    this.attr_id = attr_id
    this.attr_version = attr_version
    this.Covered = this.parseCovered(Covered)
    this.AirConditioned = AirConditioned
    this.SmokingAllowed = SmokingAllowed
    this.TotalCapacity = TotalCapacity
     this.gridMarkers = gridMarkers
          ? extractElementList(gridMarkers.GridMarkers, GridMarker)
          : []
    }

    parseCovered(value: boolean | string | undefined): CoveredType {
        if (!value) { 
            return 'unknown' 
        }
        if (value === true) {
            return 'covered'
        }
        if (allCoveredTypes.includes(value as CoveredType)) {
            return value as CoveredType
        }
        return 'unknown'
    }
}
