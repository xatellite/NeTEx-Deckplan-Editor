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
  Width: number
  Length: number

  constructor({
    attr_id,
    attr_version,
    deckSpaces,
    spotRows = undefined,
    spotColumns = undefined,
    DeckLevelRef = undefined,
    Name = undefined,
    polygon = undefined,
    Width = 2.825,
    Length = 26.4,
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
    Width: number
    Length: number
  }) {
    this.attr_id = attr_id
    this.attr_version = attr_version
    this.Name = Name ? new GeneralName(Name) : undefined
    this.polygon = polygon ? new Polygon(polygon) : undefined
    this.DeckLevelRef = DeckLevelRef ? new GeneralDeckLevelRef(DeckLevelRef) : undefined
    this.Width = Width
    this.Length = Length
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
      Width: this.Width,
      Length: this.Length,
    }
  }

  getBoundingBox() {
    const width = this.Length
    const height = this.Width

    return { width, height }
  }

  getShape(scale: number) {
    const { width, height } = this.getBoundingBox()

    return {
      x: 5,
      y: 5,
      width: width * scale,
      height: height * scale,
      fill: 'white',
      stroke: 'gray',
      strokeWidth: 2,
      cornerRadius: 5,
    }
  }
}
