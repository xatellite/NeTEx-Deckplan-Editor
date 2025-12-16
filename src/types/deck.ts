import { DeckLevelRef as GeneralDeckLevelRef } from './deckLevel'
import { extractElementList, Name as GeneralName, serializeElements } from './general'
import { OtherDeckSpace } from './otherDeckSpace'
import { PassengerSpace } from './passengerSpace'
import { Polygon } from './polygon'
import { SpotColumn } from './spotColumn'
import { SpotRow } from './spotRow'

export class Deck {
  attr_id: string
  attr_version: string
  Name: GeneralName | undefined
  polygon: Polygon | undefined
  deckspaces: (OtherDeckSpace | PassengerSpace)[]
  DeckLevelRef: GeneralDeckLevelRef | undefined
  spotRows: SpotRow[]
  spotColumns: SpotColumn[]

  constructor({
    attr_id,
    attr_version,
    deckspaces,
    spotRows = undefined,
    spotColumns = undefined,
    DeckLevelRef = undefined,
    Name = undefined,
    polygon = undefined,
  }: {
    attr_id: string
    attr_version: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deckspaces: { OtherDeckSpace: any[]; PassengerSpace: any[] }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spotRows: { SpotRow: any[] } | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spotColumns: { SpotColumn: any[] } | undefined
    DeckLevelRef: GeneralDeckLevelRef | undefined
    Name: string | undefined
    polygon: object | undefined
  }) {
    this.attr_id = attr_id
    this.attr_version = attr_version
    this.Name = Name ? new GeneralName(Name) : undefined
    this.polygon = polygon ? new Polygon(polygon) : undefined
    this.DeckLevelRef = DeckLevelRef ? new GeneralDeckLevelRef(DeckLevelRef) : undefined
    this.deckspaces = deckspaces ? Object.entries(deckspaces).flatMap(([k, d]) => {
      if (k === 'OtherDeckSpace') {
        d.map((oD) => new OtherDeckSpace(oD))
      }
      if (k === 'PassengerSpace') {
        d.map((ps) => new PassengerSpace(ps))
      }
      return []
    }) : []
    this.spotRows = extractElementList(spotRows?.SpotRow, SpotRow)
    this.spotColumns = extractElementList(spotColumns?.SpotColumn, SpotColumn)
  }

  toXML() {
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      spotRows: {SpotRow: serializeElements(this.spotRows)},
      spotColumns: {SpotColumn: serializeElements(this.spotColumns)},
      DeckLevelRef: this.DeckLevelRef?.toXML(),
      polygon: this.polygon?.toXML(),
      Name: this.Name?.toXML(),
    }
  }

  getShape() {
    if (this.polygon) {
      console.log('do something')
    }

    return {
      x: 10,
      y: 10,
      width: 500,
      height: 100,
      fill: 'white',
      stroke: 'gray',
      strokeWidth: 2,
      cornerRadius: 5,
    }
  }
}
