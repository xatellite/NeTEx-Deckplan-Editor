export class Centroid {
  x: number
  y: number


  constructor(x: number, y: number) {
      this.x = x
      this.y = y
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromXML(value: any) {
    console.log(value)
    const pos = value?.Location?.['gml:pos']?.['text_value']
    console.log(pos)
    if (pos) {
      const [x, y] = pos.split(' ').map(Number)
      return new Centroid(x,y)
    } else {
      return new Centroid(0,0)
    }
  }

  toXML() {
    return {
      Location: {
        'gml:pos': `${this.x} ${this.y}`,
      },
    }
  }
}
