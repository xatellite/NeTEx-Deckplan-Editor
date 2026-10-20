import { PassengerSpace, PassengerSpot } from 'netex-deckplan-library'

export const getSeats = (space: PassengerSpace) => {
  return space.passengerSpots?.filter((spot): spot is PassengerSpot => spot instanceof PassengerSpot && spot.Centroid !== undefined)
}

export const getBackRest = (seat: PassengerSpot) => {
  const halfWidth = seat.Width / 2
  const halfLength = seat.Length / 2

  const padding = Math.min(seat.Width, seat.Length) * 0.1

  switch (seat.Orientation) {
    case "backwards":
      return {
        x1: halfWidth - padding, y1: -halfLength + padding,
        x2: halfWidth - padding, y2: halfLength - padding,
      }

    case "forwards":
      return {
        x1: -halfWidth + padding, y1: -halfLength + padding,
        x2: -halfWidth + padding, y2: halfLength - padding,
      }

    case 'leftwards':
      return {
        x1: -halfWidth + padding, y1: halfLength - padding,
        x2: halfWidth - padding, y2: halfLength - padding,
      }

    case 'rightwards':
      return {
        x1: -halfWidth + padding, y1: -halfLength + padding,
        x2: halfWidth - padding, y2: -halfLength + padding,
      }

    default:
      return undefined
  }
}