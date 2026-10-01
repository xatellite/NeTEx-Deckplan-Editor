"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const jsonix_1 = require("@docx4j/jsonix");
const uk_org_netex_netex_js_1 = require("./generated/uk_org_netex_netex.js");
const uk_org_siri_siri_js_1 = require("./generated/uk_org_siri_siri.js");
const net_opengis_gml__3_js_1 = require("./generated/net_opengis_gml__3.js");
const context = new jsonix_1.Jsonix.Context([uk_org_netex_netex_js_1.uk_org_netex_netex, uk_org_siri_siri_js_1.uk_org_siri_siri, net_opengis_gml__3_js_1.net_opengis_gml__3], {
    namespacePrefixes: {
        'http://www.netex.org.uk/netex': '',
        'http://www.opengis.net/gml/3.2': 'gml',
        'http://www.siri.org.uk/siri': 'siri',
    },
});
// Read XML file as text
const xml = fs.readFileSync(path.join(import.meta.dirname, 'example.xml'), 'utf8');
// XML → model
const model = context.createUnmarshaller().unmarshalString(xml);
console.log('Loaded root:', model.name.localPart);
// Find deckplan
const compositeFrame = model.value.dataObjects.compositeFrameOrCommonFrame[0];
// console.log("COMPOSITE FRAME: ", compositeFrame)
const frame = compositeFrame.value.frames.commonFrame[0];
const deckPlan = frame.value.deckPlans.deckPlan[0];
const deck = deckPlan.decks.deck[0];
const deckSpace = deck.deckSpaces.deckSpaceRefOrDeckSpaceDummy.find((ds) => ds.value.id === 'example:PassengerSpace:standard_saloon');
// Update total capacity
deckSpace.value.totalCapacity = 60;
// Update PassengerSpot Orientation
const passengerSpot = deckSpace.value.passengerSpots.passengerSpotRefOrPassengerSpot.find((ps) => ps.id === 'passenger_spot_1b');
passengerSpot.orientation = 'leftwards';
// Delete passenger_spot_10d
const passengerSpots = deckSpace.value.passengerSpots;
passengerSpots.passengerSpotRefOrPassengerSpot = passengerSpots.passengerSpotRefOrPassengerSpot.filter((ps) => ps.id !== 'passenger_spot_10d');
console.log("FILTERED SPOTS: ", passengerSpots.passengerSpotRefOrPassengerSpot);
fs.writeFileSync(path.join(import.meta.dirname, 'model.json'), JSON.stringify(model, null, 2));
// Model → XML
const exported = context.createMarshaller().marshalString(model);
const exportedXml = '<?xml version="1.0" encoding="UTF-8"?>\n' + exported;
fs.writeFileSync(path.join(import.meta.dirname, 'exported.xml'), exportedXml);
// Check that the exported XML can be loaded again
const reloaded = context.createUnmarshaller().unmarshalString(exported);
console.log('Reloaded root:', reloaded.name.localPart);
// loadNeTExFile
// loadDeckPlan
// getDecks
// getDeckSpaces
// getLocateableSpots
