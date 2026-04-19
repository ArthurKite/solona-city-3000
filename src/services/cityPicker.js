import cities from '../data/frenchCities.json'

export function pickRandomCity() {
  const index = Math.floor(Math.random() * cities.length)
  return cities[index]
}
