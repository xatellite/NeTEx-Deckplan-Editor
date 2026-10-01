import * as fs from 'fs'
import * as path from 'path'
import { Jsonix } from 'jsonix'

import { uk_org_netex_netex } from '../generated/uk_org_netex_netex.js'
import { uk_org_siri_siri } from '../generated/uk_org_siri_siri.js'
import { net_opengis_gml__3 } from '../generated/net_opengis_gml__3.js'

import type { CompositeFrame } from '../generated/uk_org_netex_netex'

const context = new Jsonix.Context(
    [uk_org_netex_netex, uk_org_siri_siri, net_opengis_gml__3],
    {
        namespacePrefixes: {
            'http://www.netex.org.uk/netex': '',
            'http://www.opengis.net/gml/3.2': 'gml',
            'http://www.siri.org.uk/siri': 'siri',
        },
    }
)

// Read XML file as text
const xml = fs.readFileSync(path.join(path.dirname('.'), 'example.xml'), 'utf8')

// XML → model
const model  = context.createUnmarshaller().unmarshalString(xml)

console.log('Loaded root:', model.name.localPart)

// Find deckplan

const compositeFrame = model.value.dataObjects.compositeFrameOrCommonFrame[0]

// console.log("COMPOSITE FRAME: ", compositeFrame)

const frame = compositeFrame.value.frames.commonFrame[0]

const deckPlan = frame.value.deckPlans.deckPlan[0]

const deck = deckPlan.decks.deck[0]

const deckSpace = deck.deckSpaces.deckSpaceRefOrDeckSpaceDummy.find((ds) => ds.value.id === 'example:PassengerSpace:standard_saloon')

// Update total capacity
deckSpace.value.totalCapacity = 60

// Update PassengerSpot Orientation
const passengerSpot = deckSpace.value.passengerSpots.passengerSpotRefOrPassengerSpot.find((ps) => ps.id === 'passenger_spot_1b')

passengerSpot.orientation = 'leftwards'

// Delete passenger_spot_10d
const passengerSpots = deckSpace.value.passengerSpots
passengerSpots.passengerSpotRefOrPassengerSpot = passengerSpots.passengerSpotRefOrPassengerSpot.filter((ps) => ps.id !== 'passenger_spot_10d')

console.log("FILTERED SPOTS: ", passengerSpots.passengerSpotRefOrPassengerSpot)

fs.writeFileSync(
    path.join(path.dirname('.'), 'model.json'),
    JSON.stringify(model, null, 2),
)

// Model → XML
const exported = context.createMarshaller().marshalString(model)

const exportedXml = '<?xml version="1.0" encoding="UTF-8"?>\n' + exported

fs.writeFileSync(path.join(path.dirname('.'), 'exported.xml'), exportedXml)

// Check that the exported XML can be loaded again
const reloaded = context.createUnmarshaller().unmarshalString(exported)

console.log('Reloaded root:', reloaded.name.localPart)

