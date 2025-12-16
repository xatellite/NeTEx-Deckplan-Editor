import { ActualVehicleEquipment } from './actualVehicleEquipment'
import { DeckEntranceCouple } from './deckEntranceCouple'
import { DeckEntranceUsage } from './deckEntranceUsage'
import { DeckSpaceCapacity } from './deckSpaceCapacity'
import { extractElementList, Name as GeneralName, serializeElementsAndRefs } from './general'
import { LuggageSpot, LuggageSpotRef } from './luggageSpot'
import { PassengerEntrance } from './passengerEntrance'
import { PassengerSpot, PassengerSpotRef } from './passengerSpot'
import { Polygon as GeneralPolygon } from './polygon'
import { Centroid as GeneralCentroid } from './centroid'
import { ServiceFacilitySetRef as GeneralServiceFacilitySetRef } from './serviceFacilitySet'

export class PassengerSpace {
  attr_id: string
  attr_version: string
  Name: GeneralName | undefined
  SmokingAllowed: boolean | undefined
  StandingAllowed: boolean | undefined
  PassengerSpaceType:
    | 'seatingArea'
    | 'passengerCabin'
    | 'vehicleArea'
    | 'luggageStore'
    | 'corridor'
    | 'restaurant'
    | 'toilet'
    | 'bathroom'
    | 'other'
    | undefined
  passengerSpots: (PassengerSpot | PassengerSpotRef)[] | undefined
  luggageSpots: (LuggageSpot | LuggageSpotRef)[] | undefined
  // passengerVehicleSpots: (PassengerVehicleSpot | PassengerVehicleSpotRef)[]
  deckEntrances: PassengerEntrance[] | undefined
  deckEntranceUsage: DeckEntranceUsage[] | undefined
  deckEntranceCouples: DeckEntranceCouple[] | undefined
  deckSpaceCapacities: DeckSpaceCapacity[] | undefined
  actualVehicleEquipments: ActualVehicleEquipment[]
  ServiceFacilitySetRef: GeneralServiceFacilitySetRef | undefined
  // spotAffinities: SpotAffinity[] | undefined
  Centroid: GeneralCentroid | undefined
  Polygon: GeneralPolygon | undefined
  PublicUse: boolean | undefined
  TotalCapacity: number | undefined
  FareClass: string | undefined
  AirConditioned: boolean | undefined

  constructor({
    attr_id,
    attr_version,
    Name,
    SmokingAllowed,
    StandingAllowed,
    PassengerSpaceType,
    passengerSpots,
    luggageSpots,
    deckEntrances,
    deckEntranceUsage,
    deckEntranceCouples,
    deckSpaceCapacities,
    actualVehicleEquipments,
    ServiceFacilitySetRef,
    // spotAffinities,
    Centroid,
    Polygon,
    PublicUse,
    TotalCapacity,
    FareClass,
    AirConditioned,
  }: {
    attr_id: string
    attr_version: string
    Name: GeneralName | undefined
    SmokingAllowed: boolean | undefined
    StandingAllowed: boolean | undefined
    PassengerSpaceType:
      | 'seatingArea'
      | 'passengerCabin'
      | 'vehicleArea'
      | 'luggageStore'
      | 'corridor'
      | 'restaurant'
      | 'toilet'
      | 'bathroom'
      | 'other'
      | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passengerSpots: {PassengerSpot: any[], PassengerSpotRef: any[]}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    luggageSpots: {LuggageSpot: any[], LuggageSpotRef: any[]}
    // passengerVehicleSpots: (PassengerVehicleSpot | PassengerVehicleSpotRef)[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deckEntrances: {PassengerEntrance: any[]}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deckEntranceUsage: {DeckEntranceUsage: any[]}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deckEntranceCouples: {DeckEntranceCouple: any[]}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deckSpaceCapacities: {DeckSpaceCapacity: any[]}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actualVehicleEquipments: {ActualVehicleEquipment: any[]}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ServiceFacilitySetRef: any | undefined
    // spotAffinities: SpotAffinity[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Centroid: any | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Polygon: any | undefined
    PublicUse: boolean | undefined
    TotalCapacity: number | undefined
    FareClass: string | undefined
    AirConditioned: boolean | undefined
  }) {
    this.attr_id = attr_id
    this.attr_version = attr_version
    this.Name = Name
    this.SmokingAllowed = SmokingAllowed
    this.StandingAllowed = StandingAllowed
    this.PassengerSpaceType = PassengerSpaceType
    this.passengerSpots = Object.entries(passengerSpots).flatMap(([k, d]) => {
        if (k === 'PassengerSpot') {
          d.map((ps) => new PassengerSpot(ps))
        }
        if (k === 'PassengerSpotRef') {
          d.map((ps) => new PassengerSpotRef(ps))
        }
        return []
      })
    this.luggageSpots = Object.entries(luggageSpots).flatMap(([k, d]) => {
        if (k === 'LuggageSpot') {
          d.map((ls) => new LuggageSpot(ls))
        }
        if (k === 'LuggageSpotRef') {
          d.map((ls) => new LuggageSpotRef(ls))
        }
        return []
      })
    this.deckEntrances = extractElementList(deckEntrances?.PassengerEntrance, PassengerEntrance)
    this.deckEntranceUsage = extractElementList(deckEntranceUsage?.DeckEntranceUsage, DeckEntranceUsage)
    this.deckEntranceCouples = extractElementList(deckEntranceCouples?.DeckEntranceCouple, DeckEntranceCouple)
    this.deckSpaceCapacities = extractElementList(deckSpaceCapacities?.DeckSpaceCapacity, DeckSpaceCapacity)
    this.actualVehicleEquipments = extractElementList(actualVehicleEquipments?.ActualVehicleEquipment, ActualVehicleEquipment)
    this.ServiceFacilitySetRef = ServiceFacilitySetRef ? new GeneralServiceFacilitySetRef(ServiceFacilitySetRef) : undefined
    // this.spotAffinities,
    this.Centroid = Centroid ? new GeneralCentroid(Centroid) : undefined
    this.Polygon = Polygon ? new GeneralPolygon(Polygon) : undefined
    this.PublicUse = PublicUse
    this.TotalCapacity = TotalCapacity
    this.FareClass = FareClass
    this.AirConditioned = AirConditioned
  }

  toXML() {
    return {
      attr_id: this.attr_id,
      attr_version: this.attr_version,
      Name: this.Name,
      SmokingAllowed: this.SmokingAllowed,
      StandingAllowed: this.StandingAllowed,
      PassengerSpaceType: this.PassengerSpaceType,
      passengerSpots: this.passengerSpots ? serializeElementsAndRefs(this.passengerSpots) : '',
      luggageSpots: this.luggageSpots ? serializeElementsAndRefs(this.luggageSpots) : undefined,
      deckEntrances: this.deckEntrances ? serializeElementsAndRefs(this.deckEntrances) : undefined,
      deckEntranceUsage: this.deckEntranceUsage ? serializeElementsAndRefs(this.deckEntranceUsage) : undefined,
      deckEntranceCouples:this.deckEntranceCouples ? serializeElementsAndRefs(this.deckEntranceCouples) : undefined,
      deckSpaceCapacities: this.deckSpaceCapacities ? serializeElementsAndRefs(this.deckSpaceCapacities) : undefined,
      actualVehicleEquipments: this.actualVehicleEquipments ? serializeElementsAndRefs(this.actualVehicleEquipments) : undefined,
      ServiceFacilitySetRef: this.ServiceFacilitySetRef?.toXML(),
      Centroid: this.Centroid?.toXML(),
      Polygon: this.Polygon?.toXML(),
      PublicUse: this.PublicUse,
      TotalCapacity: this.TotalCapacity,
      FareClass: this.FareClass,
      AirConditioned: this.AirConditioned,
    }
  }
}
