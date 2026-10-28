/** Übernommen aus quizos-potpourri-limburg (lib/wortfilter.ts), dort aus audience-irish-pub-limburg.
 *  Ergänzt für die Website: „weniger“, „Reiniger“ und „Peiniger“ als harmlose Ausnahmen.
 *
 *  Grobe Woerter in Namen, die Gaeste eintippen (Kostueme, Vorschlaege).
 *
 *  Die Freigabe im Pult bleibt die eigentliche Pruefung. Der Filter nimmt
 *  ihr nur das Offensichtliche ab, damit es gar nicht erst auf dem Tablet
 *  landet - am 15.10. stand "Großerreicherpenis69" zur Wahl.
 *
 *  Verglichen wird nach einer Glaettung: klein, Umlaute ausgeschrieben,
 *  Zahlen und Zeichen, die Buchstaben vertreten (3 fuer e, @ fuer a), als
 *  Buchstaben, doppelte Buchstaben einfach. So faellt "P3n1ss" genauso auf
 *  wie "Penis".
 *  - TEILE treffen auch mitten im Wort ("Riesenpenis").
 *  - WOERTER treffen nur als ganzes Wort, weil sie in harmlosen Woertern
 *    stecken ("Arsch" in "Marschall", "Nutte" geglaettet
 *    in "Minute", "Mongo" in "Mongolei"). */
const TEILE = [
  'penis', 'vagina', 'fotze', 'votze', 'muschi', 'wichs', 'wixer', 'fick', 'fuck', 'hurenso', 'schlampe',
  'arschloch', 'schwanzlutsch', 'blowjob', 'porno', 'titen', 'pimel', 'kacke', 'scheis', 'shit', 'bitch',
  'hitler', 'nazi', 'siegheil', 'hakenkreuz', 'neger', 'niger', 'kanake', 'schwuchtel', 'misgeburt', 'vergewaltig',
]
const WOERTER = ['arsch', 'sex', 'spast', 'mongo', 'cock', 'cum', 'hure', 'nute', 'heil', 'nsdap', 'ss']

function lesbar(text: string) {
  return text.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[0@4]/g, (z) => (z === '0' ? 'o' : 'a'))
    .replace(/[1!|]/g, 'i').replace(/3/g, 'e').replace(/[5$]/g, 's').replace(/7/g, 't')
}
const glaetten = (text: string) => lesbar(text).replace(/(.)\1+/g, '$1')
const woerterVon = (text: string) => text.split(/[^a-z]+/).filter(Boolean)

/** Enthaelt der Text ein grobes Wort? */
export function grobesWort(text: string) {
  const glatt = glaetten(text)
  // Harmlose Woerter, in denen ein Teil steckt: Ignazio, Nigeria, Shiitake, weniger.
  const am_stueck = glatt.replace(/[^a-z]/g, '').replace(/ignazi|nigeri|shitak|weniger|reiniger|peiniger/g, '')
  if (TEILE.some((t) => am_stueck.includes(t))) return true
  // Ganze Woerter einmal geglaettet, einmal nur lesbar gemacht - sonst
  // wuerde aus "SS" beim Glaetten ein einzelnes "s".
  return [...woerterVon(glatt), ...woerterVon(lesbar(text))].some((w) => WOERTER.includes(w))
}
