export type Point = {
  x: number
  y: number
}

type PolygonData = {
  exterior?: {
    LinearRing?: {
      posList?: string | {
        text_value?: string
        '#text'?: string
        attr_srsDimension?: number | string
      }
    }
  }
}

export class Polygon {
  value: PolygonData

  constructor(value: PolygonData) {
    this.value = value
  }

  get points(): Array<Point> {
    const posList = this.value.exterior?.LinearRing?.posList

    const list = typeof posList === 'string' ? posList : posList?.
   ['#text'] ?? posList?.text_value

    if (!list) {
      return []
    }

    const coordinates = list.trim().split(/\s+/).map(Number)

    // if coordinates has odd numbers or invalid values then we return an empty array.
    if (coordinates.length < 2 || coordinates.length % 2 !== 0 || coordinates.some(isNaN)) {
      return []
    }

    const points: Array<Point> = []

    for (let i = 0; i < coordinates.length; i += 2) {
      points.push({
        x: coordinates[i],
        y: coordinates[i+1]
      })
    }

    const first = points[0]
    const last = points[points.length - 1]

    if (first.x !== last.x || first.y !== last.y) {
      throw new Error('Polygon must start and end at the same point')
    }

    return points
  }

  get boundingBox() {
    if (this.points.length === 0) {
      return undefined
    }

    const xs = this.points.map(point => point.x)
    const ys = this.points.map(point => point.y)

    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

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

  toXML() {
    return this.value
  }
}
