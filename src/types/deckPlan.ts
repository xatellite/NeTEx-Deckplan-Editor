import { Deck } from './deck'
import { DeckLevel } from './deckLevel'
import { extractElementList, serializeElements } from './general'

export class DeckPlan {
  attr_id: string
  attr_version: string
  deckLevels: DeckLevel[]
  decks: Deck[]

  constructor({
    attr_id,
    attr_version,
    decks = undefined,
    deckLevels = undefined,
  }: {
    attr_id: string
    attr_version: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deckLevels: { DeckLevel: any[] } | { DeckLevel: any } | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decks: { Deck: any[] } | { Deck: any } | undefined
  }) {
    this.attr_id = attr_id
    this.attr_version = attr_version
    this.deckLevels = extractElementList(deckLevels?.DeckLevel, DeckLevel)
    this.decks = extractElementList(decks?.Deck, Deck)
  }

  toXML() {
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      decks: {Deck: serializeElements(this.decks)},
      deckLevels: {DeckLevel: serializeElements(this.deckLevels)},
    }
  }
}
