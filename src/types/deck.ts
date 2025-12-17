import { DeckLevelRef as GeneralDeckLevelRef } from './deckLevel'
import {
  extractElementList,
  Name as GeneralName,
  serializeElements,
  serializeElementsAndRefs,
} from './general'
import { OtherDeckSpace } from './otherDeckSpace'
import { PassengerSpace } from './passengerSpace'
import { Polygon } from './polygon'
import { SpotColumn } from './spotColumn'
import { SpotRow } from './spotRow'

export class Deck {
  attr_id: string
  attr_version: string
  Name: string
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
    Width = undefined,
    Length = undefined,
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
    Name: { text_value: string } | undefined
    polygon: object | undefined
    Width: { text_value: number } | undefined
    Length: { text_value: number } | undefined
  }) {
    this.attr_id = attr_id
    this.attr_version = attr_version
    this.Name = Name?.text_value || ''
    this.polygon = polygon ? new Polygon(polygon) : undefined
    this.DeckLevelRef = DeckLevelRef ? new GeneralDeckLevelRef(DeckLevelRef) : undefined
    this.Width = Width?.text_value || 2.825
    this.Length = Length?.text_value || 26.4
    this.deckspaces = deckSpaces
      ? Object.entries(deckSpaces).flatMap(([k, d]) => {
          if (k === 'OtherDeckSpace') {
            return extractElementList(d, OtherDeckSpace) as OtherDeckSpace[]
          }
          if (k === 'PassengerSpace') {
            return extractElementList(d, PassengerSpace) as PassengerSpace[]
          }
          return []
        })
      : []
    this.spotRows = extractElementList(spotRows?.SpotRow, SpotRow)
    this.spotColumns = extractElementList(spotColumns?.SpotColumn, SpotColumn)
  }

  toXML() {
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      spotRows: { SpotRow: serializeElements(this.spotRows) },
      spotColumns: { SpotColumn: serializeElements(this.spotColumns) },
      deckSpaces: serializeElementsAndRefs(this.deckspaces),
      DeckLevelRef: this.DeckLevelRef?.toXML(),
      polygon: this.polygon?.toXML(),
      Name: {text_value: this.Name},
      Width: {text_value: this.Width},
      Length: {text_value: this.Length},
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
