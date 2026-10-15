import { DeckPlan, BoundingBox } from './model/index.js'

export const getDecksBoundingBox = (deckplan: DeckPlan): BoundingBox | undefined => {
  const boxes: Array<BoundingBox> = deckplan.decks.map((deck) => deck.polygon?.boundingBox)
    .filter((box) => box !== undefined)

  if (boxes.length === 0) {
    return undefined
  }

  const minX = Math.min(...boxes.map((box) => box.minX))
  const maxX = Math.max(...boxes.map((box) => box.maxX))
  const minY = Math.min(...boxes.map((box) => box.minY))
  const maxY = Math.max(...boxes.map((box) => box.maxY))

  return {
    minX,
    maxX,
    minY,
    maxY,
    length: maxX - minX,
    width: maxY - minY,
    center: {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2
    }
  }
}