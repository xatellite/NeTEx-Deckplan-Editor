import { DeckLevelRef as GeneralDeckLevelRef } from './deckLevel'
import { extractElementList, Name as GeneralName, serializeElements, serializeElementsAndRefs } from './general'
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
    deckSpaces,
    spotRows = undefined,
    spotColumns = undefined,
    DeckLevelRef = undefined,
    Name = undefined,
    polygon = undefined,
  }: {
    attr_id: string
    attr_version: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deckSpaces: { OtherDeckSpace: any | any[]; PassengerSpace: any | any[] }
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
    console.log("deckspace", deckSpaces)
    this.deckspaces = deckSpaces ? Object.entries(deckSpaces).flatMap(([k, d]) => {
      console.log("key", k, d)
      if (k === 'OtherDeckSpace') {
        return extractElementList(d, OtherDeckSpace) as OtherDeckSpace[]
      }
      if (k === 'PassengerSpace') {
        return extractElementList(d, PassengerSpace) as PassengerSpace[]
      }
      return []
    }) : []
    this.spotRows = extractElementList(spotRows?.SpotRow, SpotRow)
    this.spotColumns = extractElementList(spotColumns?.SpotColumn, SpotColumn)
  }

  toXML() {
    console.log("deckspaces", this.deckspaces, serializeElementsAndRefs(this.deckspaces))
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      spotRows: {SpotRow: serializeElements(this.spotRows)},
      spotColumns: {SpotColumn: serializeElements(this.spotColumns)},
      deckSpaces: serializeElementsAndRefs(this.deckspaces),
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
      x: 0,
      y: 0,
      width: 1000,
      height: 300,
      fill: 'white',
      stroke: 'gray',
      strokeWidth: 2,
      cornerRadius: 5,
    }
  }
}
