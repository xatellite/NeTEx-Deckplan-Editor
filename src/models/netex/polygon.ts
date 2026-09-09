export type Point = [number, number]

export class Polygon {
  attr_id: string
  points: Point[]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(value: any) {
    this.attr_id = value?.attr_id ?? ''
    this.points = Polygon.parseLinearRing(value?.exterior?.LinearRing)
  }

  static fromPoints(id: string, points: Array<Point>): Polygon {
    const polygon = new Polygon(undefined)
    polygon.attr_id = id
    polygon.points = points
    return polygon
  }

  static fromSize(id: string, length: number, width: number): Polygon {
    return Polygon.fromPoints(id, [
      [0, 0],
      [length, 0],
      [length, width],
      [0, width],
      [0, 0],
    ])
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static parseLinearRing(ring: any): Array<Point> {
    if (!ring) {
      return []
    }

    const coordinates =
      ring.posList !== undefined
        ? String(ring.posList?.['#text'] ?? ring.posList)
        : [ring.pos ?? []].flat().join(' ')

    const nums = coordinates.split(/\s+/).filter(Boolean).map(Number)

    // if nums has odd numbers or invalid values then the ring is wrong.
    if (nums.length < 2 || nums.length % 2 !== 0 || nums.some(isNaN)) return []

    const points: Point[] = []
    for (let i = 0; i < nums.length; i += 2) {
      const point: Point = [nums[i]!, nums[i + 1]!]
      points.push(point)
    }

    return points
  }

  get boundingBox() {
    if (this.points.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0 }

    const xs = this.points.map(([x]) => x)
    const ys = this.points.map(([, y]) => y)

    return {
      minX: Math.min(...xs),
      minY: Math.min(...ys),
      maxX: Math.max(...xs),
      maxY: Math.max(...ys),
    }
  }

  get length(): number {
    const { minX, maxX } = this.boundingBox
    return maxX - minX
  }

  get width(): number {
    const { minY, maxY } = this.boundingBox
    return maxY - minY
  }

  toXML() {
    return {
      'attr_gml:id': this.attr_id,
      'gml:exterior': {
        'gml:LinearRing': {
          'gml:posList': this.points.map(([x, y]) => `${x} ${y}`).join(' '),
        },
      },
    }
  }
}
