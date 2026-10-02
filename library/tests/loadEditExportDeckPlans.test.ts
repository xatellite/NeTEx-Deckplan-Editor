import { describe, expect, test } from 'bun:test'
import { loadNeTEx } from '../src/library.js'
import { PassengerSpace, PassengerSpot, PassengerSpotRef } from '../src/model'

const loadPassengerSpace = async () => {
  const path = new URL('./fixtures/deckplan.xml', import.meta.url)
  const xml = await Bun.file(path).text()
  const [deckPlan] = loadNeTEx(xml)

  if (deckPlan.decks.length === 0) {
    throw new Error('No decks found.')
  }

  const deck = deckPlan.decks[0]

  const passengerSpace = deck.deckspaces.find(
    (ps) => ps instanceof PassengerSpace,
  )

  if (!passengerSpace) {
    throw new Error('No passenger space found.')
  }

  return passengerSpace
}

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
    const passengerSpace = await loadPassengerSpace()

    const passengerSpot = passengerSpace.passengerSpots.find((ps) => ps instanceof PassengerSpot)
    if (!passengerSpot) {
      throw new Error('No passenger spot found.')
    }

    expect(passengerSpot.Label).not.toBe('X34')

    passengerSpot.Label = 'X34'

    expect(passengerSpot.Label).toBe('X34')
  })

  test('delete seat', async () => {
    const passengerSpace = await loadPassengerSpace()
    const seatId = 'passenger_spot_10d'

    const isTargetSeat = (ps: PassengerSpot | PassengerSpotRef) => ps instanceof PassengerSpot && ps.attr_id === seatId

    expect(passengerSpace.passengerSpots.find(isTargetSeat)).toBeDefined()

    passengerSpace.passengerSpots = passengerSpace.passengerSpots.filter((ps) => !isTargetSeat(ps))

    expect(passengerSpace.passengerSpots.find(isTargetSeat)).toBeUndefined()
  })
})

