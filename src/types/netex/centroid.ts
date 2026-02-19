export class Centroid {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromXML(value: any) {
    const pos = value?.Location?.pos
    if (typeof pos === 'string') {
      const [x, y] = pos.split(' ').map(Number)
      if (typeof x === 'number' && typeof y === 'number') {
        return new Centroid(x, y)
      }
    } else {
      return new Centroid(0, 0)
    }
  }

  toXML() {
    return {
      Location: {
        pos: `${this.x} ${this.y}`,
      },
    }
  }
}
