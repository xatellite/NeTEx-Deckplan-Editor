import { DeckPlan } from '@/types/netex/deckPlan'
import { extractElementList } from '@/types/netex/general'
import { XMLParser } from 'fast-xml-parser'

export const parseNeTEx = (xml: string) => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: 'attr_',
    textNodeName: 'text_value',
    removeNSPrefix: true,
  })

  const delivery = parser.parse(xml)

  return extractElementList(
    delivery.PublicationDelivery.dataObjects.CompositeFrame.frames.ResourceFrame.deckPlans.DeckPlan,
    DeckPlan,
  )
}
