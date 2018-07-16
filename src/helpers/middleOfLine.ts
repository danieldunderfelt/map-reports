// From http://stackoverflow.com/a/18883823/5710637
function calcCrow(lat1, lon1, lat2, lon2) {
  let R = 6371 // km
  let dLat = toRad(lat2 - lat1)
  let dLon = toRad(lon2 - lon1)
  let radLat1 = toRad(lat1)
  let radLat2 = toRad(lat2)

  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2)
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  let d = R * c
  return d
}

// Converts numeric degrees to radians
// From http://stackoverflow.com/a/18883823/5710637
function toRad(Value) {
  return (Value * Math.PI) / 180
}

// Returns a point from a line
// Should use halversine but i'm too bad at math
function getPoint(factor, lat1, lon1, lat2, lon2) {
  while (lat1 < 0) {
    lat1 += 360
  }
  while (lat2 < lat1) {
    lat2 += 360
  }
  let latPoint = lat1 + factor * (lat2 - lat1)
  latPoint = ((latPoint + 180) % 360) - 180
  let otherLat = latPoint < 0 ? latPoint + 180 : latPoint - 180
  latPoint = Math.abs(latPoint) < Math.abs(otherLat) ? latPoint : otherLat
  let lonPoint = lon1 + factor * (lon2 - lon1)
  return [lonPoint, latPoint] // Return order same as geojson/GIS
}

function getHalfDistance(coordinates) {
  // Coordinate lat/lng order should be same as in geojson/GIS,
  // ie longitude first, latitude last: [lng, lat]

  // Calculate complete distance
  let totalDistance = 0
  for (let i = 1; i < coordinates.length; i++) {
    totalDistance += calcCrow(
      coordinates[i - 1][1],
      coordinates[i - 1][0],
      coordinates[i][1],
      coordinates[i][0]
    )
  }

  // Find the 50%
  let target = 0.5
  let currentDistance = 0
  for (let i = 1; i < coordinates.length; i++) {
    let thisDistance = calcCrow(
      coordinates[i - 1][1],
      coordinates[i - 1][0],
      coordinates[i][1],
      coordinates[i][0]
    )
    if (target * totalDistance < currentDistance + thisDistance) {
      let midDistance = target * totalDistance - currentDistance
      let factor = midDistance / thisDistance
      return getPoint(
        factor,
        coordinates[i - 1][1],
        coordinates[i - 1][0],
        coordinates[i][1],
        coordinates[i][0]
      )
    }
    currentDistance += thisDistance
  }

  return null
}

export default getHalfDistance
