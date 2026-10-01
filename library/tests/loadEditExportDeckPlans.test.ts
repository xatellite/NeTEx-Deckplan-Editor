import { describe, expect, test } from 'bun:test'
import { loadNeTEx } from '../src/library.js'
import { PassengerSpace, PassengerSpot } from '../src/model'

describe('load deck plans', () => {
  test('loads a XML file and parses it', async () => {
    const xml = await Bun.file(new URL('./fixtures/deckplan.xml', import.meta.url)).text()

    const [deckPlan] = loadNeTEx(xml)

    expect(deckPlan.attr_id).toBe('example:DeckPlan:coach_a')
  })

  test('loads a deck plan and parses it', () => {
    const xml = `
    <DeckPlan
      xmlns="http://www.netex.org.uk/netex"
      id="example:DeckPlan:test"
      version="1.0"
    >
      <deckLevels />
      <decks />
    </DeckPlan>
  `

    const [deckPlan] = loadNeTEx(xml)

    expect(deckPlan.attr_id).toBe("example:DeckPlan:test")
    expect(deckPlan.decks).toEqual([])
  })
})

describe('edit deck plans', () => {
  test('edit seat label', async () => {
    const xml = await Bun.file(new URL('./fixtures/deckplan.xml', import.meta.url)).text()

    const [deckPlan] = loadNeTEx(xml)

    expect(deckPlan.decks.length).toBeGreaterThan(0)

    const deck = deckPlan.decks[0]

    const passengerSpace = deck.deckspaces.find((ds) => ds instanceof PassengerSpace)
    if (!passengerSpace) {
      throw new Error('No passenger space found.')
    }

    const passengerSpot = passengerSpace.passengerSpots.find((ps) => ps instanceof PassengerSpot)
    if (!passengerSpot) {
      throw new Error('No passenger spot found.')
    }

    expect(passengerSpot.Label).not.toBe('X34')

    passengerSpot.Label = 'X34'

    expect(passengerSpot.Label).toBe('X34')
  })
})

