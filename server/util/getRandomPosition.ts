function getRandomPosition(lat, lng, distance = 10000) {
  // Convert to radians
  lat *= Math.PI / 180
  lng *= Math.PI / 180

  let radius

  // Distance should be set in meters, negative for exact distance
  if (distance < 0) {
    // Exact distance
    radius = Math.abs(distance)
  } else {
    // Get uniformly-random distribution within peovided distance
    // http://stackoverflow.com/questions/5837572/generate-a-random-point-within-a-circle-uniformly
    radius = Math.random() + Math.random()
    radius = radius > 1 ? 2 - radius : radius
    radius *= distance ? distance : 10000 // multiply by distance meters
  }

  // Convert radius from meters to degrees to radians
  // 111319.9 meters = one degree along the equator
  radius /= 111319.9
  // Correction for the actual distance from equator is NOT needed here
  // radius *= Math.cos(lat);
  // Convert to radians
  radius *= Math.PI / 180

  // Random angle
  const angle = Math.random() * Math.PI * 2

  // Get a point {nLat,nLng} in a distance={radius} out on the {angle} radial from point {lat,lng}
  // From Aviation Formulary V1.46 By Ed Williams:
  // → http://williams.best.vwh.net/avform.htm#LL
  // → ftp://ftp.bartol.udel.edu/anita/amir/My_thesis/Figures4Thesis/CRC_plots/Aviation%20Formulary%20V1.46.pdf
  // → https://github.com/arildj78/AvCalc/blob/master/avform.txt
  // [section "Lat/lon given radial and distance"]
  let nLng,
    nLat = Math.asin(
      Math.sin(lat) * Math.cos(radius) +
        Math.cos(lat) * Math.sin(radius) * Math.cos(angle),
    )
  if (Math.cos(nLat) == 0) {
    nLng = lng
  } else {
    nLng =
      ((lng -
        Math.asin((Math.sin(angle) * Math.sin(radius)) / Math.cos(nLat)) +
        Math.PI) %
        (Math.PI * 2)) -
      Math.PI
  }

  // Convert to degrees
  nLat *= 180 / Math.PI
  nLng *= 180 / Math.PI

  return { latitude: nLat, longitude: nLng }
}

export default getRandomPosition
