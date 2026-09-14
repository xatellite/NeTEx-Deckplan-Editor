import {
  DeckLevel,
  DeckLevelRef,
  DeckLevelRef as GeneralDeckLevelRef,
} from '../decklevels/deckLevel'
import { extractElementList, serializeElements, serializeElementsAndRefs } from '../../general'
import { OtherDeckSpace } from './deckspace/otherDeckSpace'
import { PassengerSpace } from './deckspace/passengerSpace'
import { Polygon as GeneralPolygon } from '../../polygon'
import { SpotColumn } from './spotColumn'
import { SpotRow } from './spotRow'

export class Deck {
  attr_id: string
  attr_version: string
  Name: string
  polygon: GeneralPolygon | undefined
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
    Polygon = undefined,
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
    Name: string | undefined
    Polygon: object | undefined
    // Legacy, non-NeTEx dimensions. Only read when there is no Polygon.
    Width?: number
    Length?: number
  }) {
    this.attr_id = attr_id
    this.attr_version = attr_version
    this.Name = Name ?? ''
    this.polygon =
      Polygon instanceof GeneralPolygon
        ? Polygon   // this is for the Deck.empty() case
        : Polygon
          ? new GeneralPolygon(Polygon)
          : GeneralPolygon.fromSize(Deck.gmlId(attr_id), Length ?? 26.4, Width ?? 2.825)
    this.DeckLevelRef = DeckLevelRef ? new GeneralDeckLevelRef(DeckLevelRef) : undefined
    this.deckspaces = deckSpaces
      ? Object.entries(deckSpaces).flatMap<OtherDeckSpace | PassengerSpace>(([k, d]) => {
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

  static empty(deckLevel: DeckLevel) {
    const attr_id = crypto.randomUUID()
    return new Deck({
      attr_id,
      attr_version: '1.0',
      deckSpaces: { OtherDeckSpace: [], PassengerSpace: [] },
      spotRows: {
        SpotRow: [
          {
            attr_id: 'spot_row_1',
            Label: '1',
          },
          {
            attr_id: 'spot_row_2',
            Label: '2',
          },
        ],
      },
      spotColumns: {
        SpotColumn: [
          {
            attr_id: 'spot_column_1',
            Label: '1',
          },
          {
            attr_id: 'spot_column_2',
            Label: '2',
          },
        ],
      },
      DeckLevelRef: new DeckLevelRef({
        attr_ref: deckLevel.attr_id,
        attr_version: '1.0',
      }),
      Name: undefined,
      Polygon: GeneralPolygon.fromSize(Deck.gmlId(attr_id), 2, 2),
    })
  }

  private static gmlId(deckId: string) {
    return `gml_${deckId.replace(/[^A-Za-z0-9_.-]/g, '_')}`
  }

  get polygonId(): string {
    return this.polygon?.attr_id || Deck.gmlId(this.attr_id)
  }

  get Length(): number {
    return this.polygon?.length ?? 0
  }
  set Length(value: number) {
    this.polygon = GeneralPolygon.fromSize(this.polygonId, value, this.Width)
  }

  get Width(): number {
    return this.polygon?.width ?? 0
  }
  set Width(value: number) {
    this.polygon = GeneralPolygon.fromSize(this.polygonId, this.Length, value)
  }

  toXML() {
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      Name: this.Name,
      'gml:Polygon': this.polygon?.toXML(),
      DeckLevelRef: this.DeckLevelRef?.toXML(),
      deckSpaces: serializeElementsAndRefs(this.deckspaces),
      spotRows: { SpotRow: serializeElements(this.spotRows) },
      spotColumns: { SpotColumn: serializeElements(this.spotColumns) },
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
