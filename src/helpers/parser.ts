import { DeckPlan } from '@/models/netex/deckplan/deckPlan'
import { extractElementList } from '@/models/netex/general'
import { XMLParser } from 'fast-xml-parser'

export const parseNeTEx = (xml: string) => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: 'attr_',
    removeNSPrefix: true,
  })

  const delivery = parser.parse(xml)

  return extractElementList(
    delivery.PublicationDelivery.dataObjects.CompositeFrame.frames.ResourceFrame.deckPlans.DeckPlan,
    DeckPlan,
  )
}



export const parseDeckplanOrNetex = (xml: string): DeckPlan => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: 'attr_',
    removeNSPrefix: true,
  })

  const delivery = parser.parse(xml)
  if (delivery.DeckPlan) {
    return delivery.DeckPlan
  }

  const deckplan = extractElementList(
    delivery.PublicationDelivery.dataObjects.CompositeFrame.frames.ResourceFrame.deckPlans.DeckPlan,
    DeckPlan,
  )[0]

  if (!deckplan) {
    throw new Error('No DeckPlan found in the provided XML')
  }

  return deckplan
}
