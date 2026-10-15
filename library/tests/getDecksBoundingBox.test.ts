import { expect, test } from 'bun:test'
import { getDecksBoundingBox, loadNeTEx } from '../src/library.js'

test('returns one bounding box that covers both decks', () => {
  const xml = `
    <DeckPlan xmlns:gml="http://www.opengis.net/gml/3.2" id="test" version="1.0">
      <deckLevels />
      <decks>
        <Deck id="deck_1" version="1.0">
          <gml:Polygon>
            <gml:exterior>
              <gml:LinearRing>
                <gml:posList srsDimension="2">0 0 10 0 10 4 0 4 0 0</gml:posList>
              </gml:LinearRing>
            </gml:exterior>
          </gml:Polygon>
        </Deck>
        <Deck id="deck_2" version="1.0">
          <gml:Polygon>
            <gml:exterior>
              <gml:LinearRing>
                <gml:posList srsDimension="2">-2 -2 6 -2 6 6 -2 6 -2 -2</gml:posList>
              </gml:LinearRing>
            </gml:exterior>
          </gml:Polygon>
        </Deck>
      </decks>
    </DeckPlan>
  `

  const [deckPlan] = loadNeTEx(xml)
  const box = getDecksBoundingBox(deckPlan)

  expect(box).toEqual({
    minX: -2,
    maxX: 10,
    minY: -2,
    maxY: 6,
    length: 12,
    width: 8,
    center: { x: 4, y: 2 },
  })
})

test('returns undefined when there are no decks', () => {
  const xml = `
    <DeckPlan id="test" version="1.0">
      <deckLevels />
      <decks />
    </DeckPlan>
  `

  const [deckPlan] = loadNeTEx(xml)

  expect(getDecksBoundingBox(deckPlan)).toBeUndefined()
})
