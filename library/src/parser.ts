import { DeckPlan } from '@/models/netex/deckplan/deckPlan'
import { extractElementList } from '@/models/netex/general'
import { XMLParser } from 'fast-xml-parser'
import { AccessVehicleEquipment, SanitaryEquipment, SeatingEquipment } from '@/models/netex/passengerEquipment'
import { ActualVehicleEquipment } from '@/models/netex/actualVehicleEquipment'

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

const equipmentTypeMap: any = {
  AccessVehicleEquipment,
  SanitaryEquipment,
  SeatingEquipment,
  ActualVehicleEquipment,
}

export const extractEquipments = (equipmentsObj: any) => {
  const equipments: any[] = []
  if (!equipmentsObj) return equipments

  Object.keys(equipmentTypeMap).forEach((type) => {
    const items = equipmentsObj[type]
    if (items) {
      if (Array.isArray(items)) {
        items.forEach((item) => equipments.push(new equipmentTypeMap[type](item)))
      } else {
        equipments.push(new equipmentTypeMap[type](items))
      }
    }
  })
  return equipments
}

export const parseDeckplanOrNetex = (xml: string): [DeckPlan, object | undefined] => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: 'attr_',
    removeNSPrefix: true,
  })

  const delivery = parser.parse(xml)
  if (delivery.DeckPlan) {
    const extractedDeckplan = extractElementList([delivery.DeckPlan], DeckPlan)[0]
    if (!extractedDeckplan) {
      throw new Error('No DeckPlan found in the provided XML')
    }
    return [extractedDeckplan, undefined]
  }

  const deckplan = extractElementList(
    delivery.PublicationDelivery.dataObjects.CompositeFrame.frames.ResourceFrame.deckPlans.DeckPlan,
    DeckPlan,
  )[0]

  if (!deckplan) {
    throw new Error('No DeckPlan found in the provided XML')
  }

  return [deckplan, delivery]
}
