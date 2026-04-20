// Pure templates — picked at random so the message feels fresh
// every time you throw the dart.
const TEMPLATES = [
  (city, short) =>
    `*🎯 Big news, team!*
I'm officially running for mayor of ${city.name}! 🗳️
My first campaign promise: free guided tours of ${short} for every citizen.
Who's with me? 🎉
Vote Solona 3000 🗳️`,

  (city, short) =>
    `*🥖 ${city.name}, are you ready?*
Solona 3000 is throwing the hat in the ring — running for mayor with one bold idea:
free croissants every Saturday morning right next to ${short}. 🌅✨
Rally with us this weekend at the town square! 🎉
Vote Solona 3000 🗳️`,

  (city, short) =>
    `*📣 Hear ye, hear ye, ${city.name}!*
After much soul-searching (and one croissant), I'm running for mayor.
Promise number one: a yearly citywide festival in honour of ${short}. 🎊
Spread the word, bring your neighbours! 🗣️🎉
Vote Solona 3000 🗳️`,

  (city, short) =>
    `*🎉 ${city.name} deserves better!*
That's why I, Solona, am officially running for mayor.
Day one in office: I'm declaring ${short} a permanent source of municipal pride. 🏆
Join the rally — bring snacks, bring friends! 🥖🤝
Vote Solona 3000 🗳️`,

  (city, short) =>
    `*🗳️ Attention, citizens of ${city.name}!*
Yes, the rumours are true — I'm running for mayor.
My platform? Renovate, illuminate and celebrate ${short} every single weekend. 🌟
See you Sunday morning at the main square. ☕
Vote Solona 3000 🗳️`,
]

// Trims the descriptor off an attraction sentence so it slots cleanly
// into another sentence. Splits on the first comma, falls back to the
// first period, and lowercases a leading "The " so phrases like
// "free tours of the Eiffel Tower" read naturally.
export function shortenAttraction(attraction) {
  if (!attraction) return ''
  const commaIdx = attraction.indexOf(',')
  const periodIdx = attraction.indexOf('.')
  let cut = -1
  if (commaIdx !== -1 && (periodIdx === -1 || commaIdx < periodIdx)) {
    cut = commaIdx
  } else if (periodIdx !== -1) {
    cut = periodIdx
  }
  const head = (cut === -1 ? attraction : attraction.slice(0, cut)).trim()
  return head.replace(/^The\b/, 'the')
}

export function buildSlackMessage(city) {
  const short = shortenAttraction(city.attraction)
  const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)]
  return template(city, short)
}
