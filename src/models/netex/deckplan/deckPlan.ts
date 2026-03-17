import { Deck } from './deck/deck'
import { DeckLevel } from './decklevels/deckLevel'
import { extractElementList, serializeElements } from '../general'
import type { PassengerSpot } from './deck/deckspace/spots/passengerSpot'
import type { LuggageSpot } from './deck/deckspace/spots/luggageSpot'
import type { PassengerSpace } from './deck/deckspace/passengerSpace'
import type { PassengerEntrance } from './deck/deckspace/entrance/passengerEntrance'

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

  static empty() {
    const deckLevel = new DeckLevel({
      Label: 'Level 1',
      attr_id: 'deck_level_0',
      attr_version: '1.0',
    })

    const deckplan = new DeckPlan({
      attr_id: crypto.randomUUID(),
      attr_version: '1.0',
      decks: { Deck: [] },
      deckLevels: {
        DeckLevel: [deckLevel],
      },
    })

    deckplan.decks.push(Deck.empty(deckLevel))

    return deckplan
  }

  addDeckLevel() {
    const deckLevel = new DeckLevel({
      attr_id: `deck_level_${this.deckLevels.length}`,
      attr_version: '1.0',
      Label: `Level ${this.deckLevels.length + 1}`,
    })

    this.deckLevels.push(deckLevel)

    this.decks.push(Deck.empty(deckLevel))
  }

  removeDeckLevel(deckLevelId: string) {
    console.log(deckLevelId, this.deckLevels)
    this.decks = this.decks.filter((deck) => deck.DeckLevelRef?.attr_ref !== deckLevelId)
    this.deckLevels = this.deckLevels.filter((deckLevel) => deckLevel?.attr_id !== deckLevelId)
    console.log(this.deckLevels)
  }

  toXML() {
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      decks: { Deck: serializeElements(this.decks) },
      deckLevels: { DeckLevel: serializeElements(this.deckLevels) },
    }
  }
}

export type BuildableElement = PassengerSpot | PassengerSpace | LuggageSpot | PassengerEntrance
