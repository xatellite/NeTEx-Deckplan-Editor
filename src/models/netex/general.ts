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

  constructor(value: { text_value: string }) {
    this.value = value?.['text_value']
  }

  toXML() {
    return { text_value: this.value }
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

interface xmlConstructor {
  xmlTagName?: string
}

export function serializeElementsAndRefs(elementsAndRefs: Serializable[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const outObj: any = {}
  elementsAndRefs.forEach((e) => {
    const construct = e.constructor as xmlConstructor
    const className = construct.xmlTagName ?? e.constructor.name

    if (!outObj[className]) {
      outObj[className] = []
    }

    outObj[className].push(e.toXML())
  })
  return outObj
}
