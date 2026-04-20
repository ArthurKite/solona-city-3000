// Reads pre-curated city info bundled in src/data/frenchCities.json.
// Kept as a service so that swapping back to a dynamic source later
// (e.g. an LLM call or third-party API) doesn't require touching the
// component layer.
export function getCityInfo(city) {
  return {
    attraction: city.attraction,
    funFact: city.funFact,
  }
}
