export enum PassengerSpotAvailability {
  Occupied = 'Occupied',
  Selected = 'Selected',
  Filtered = 'Filtered',
  Defect = 'Defect',
  Undefined = 'Undefined',
}

export type Availability = Record<string, PassengerSpotAvailability>
