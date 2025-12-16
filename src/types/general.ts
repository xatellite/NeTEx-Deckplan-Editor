export class Text {
  value: string

  constructor({ value }: { value: string }) {
    this.value = value
  }

  toXML() {
    return this.value
  }
}

export class Name {
  value: string

  constructor(value: string) {
    this.value = value
  }

  toXML() {
    return this.value
  }
}

export class Label {
  value: string

  constructor({ value }: { value: string }) {
    this.value = value
  }

  toXML() {
    return this.value
  }
}

export function extractElementList<TInput, TOutput>(
  element: TInput | TInput[] | undefined,
  ElementConstructor: new (e: TInput) => TOutput,
) {
  if (element) {
    if (Array.isArray(element)) {
      return element.map((e) => new ElementConstructor(e))
    }
    return [new ElementConstructor(element)]
  }
  return []
}

interface Serializable {
  toXML(): object
}

export function serializeElements(elements: Serializable[]) {
  return elements.map((e) => e.toXML())
}


export function serializeElementsAndRefs(elementsAndRefs:  Serializable[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const outObj: any = {}
  elementsAndRefs.forEach((e) => {
    const className = e.constructor.name
    if (!Object.keys(outObj).includes(className)) {
      outObj[className] = []
    }
    outObj[className].push(e.toXML())
  })
  return outObj
}
