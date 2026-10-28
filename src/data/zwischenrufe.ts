// Antworten des Dekodierers auf Eingaben, die kein Briefing-Wort sind.
// Regeln wie überall: Sie-Form, kein „man“, kein „nicht“, kein Konjunktiv.

export type Antwort = [kat: string, text: string]

// Bekannte Eingaben, jeweils mit ganzen Wörtern (klein, Umlaute wie getippt)
export const BEKANNT: [string[], Antwort][] = [
  [['hallo', 'hi', 'hey', 'moin', 'servus', 'tach', 'guten tag', 'grüß gott', 'huhu'], ['Begrüßung', 'Hallo zurück. Und jetzt: Wie soll Ihr Unternehmen wirken?']],
  [['test', 'testen', 'asdf', 'qwertz', 'qwerty', 'abc', 'xyz', 'blabla', 'bla', 'lorem', 'ipsum'], ['Probelauf', 'Test bestanden, das Feld funktioniert. Jetzt Ihr echtes Wort?']],
  [['pizza', 'döner', 'pommes', 'burger', 'schnitzel', 'currywurst', 'essen', 'hunger'], ['Atmosphäre', 'Warm, rund und für alle verständlich. Als Briefing ein guter Anfang. Zum Erstgespräch gibt es trotzdem nur Kaffee.']],
  [['kaffee', 'espresso', 'cappuccino', 'tee'], ['Atmosphäre', 'Gern, beim Besuch vor Ort. Für Ihren Auftritt brauche ich noch ein Adjektiv dazu.']],
  [['bier', 'wein', 'sekt', 'schnaps', 'prost', 'feierabend'], ['Atmosphäre', 'Für Brauereien und Weingüter beginnt alles beim Etikett. Für alle anderen mit einem Wort über Ihren Auftritt.']],
  [['katze', 'katzen', 'hund', 'hunde', 'welpe', 'kätzchen', 'einhorn'], ['Bildsprache', 'Tiere funktionieren im Netz immer. Für Ihr Unternehmen suchen wir ein Motiv, das nur Ihnen gehört.']],
  [['sebastian', 'knust', 'sebastian knust', 'du', 'dich'], ['Begrüßung', 'Freut mich. Jetzt bitte ein Wort über Ihr Unternehmen.']],
  [['egal', 'keine ahnung', 'weiß nicht', 'weiss nicht', 'irgendwas', 'irgendwie', 'keine idee', 'kp'], ['Im Gespräch', 'Ein ehrlicher Anfang. Genau dafür gibt es das Erstgespräch: Das Wort finden wir gemeinsam.']],
  [['geil', 'krass', 'nice', 'wow', 'mega', 'hammer', 'fett', 'lit', 'awesome', 'amazing'], ['Tonalität', 'Begeisterung ist ein gutes Zeichen. Welche Wirkung steckt dahinter, eher auffällig oder eher ruhig?']],
  [['gut', 'besser', 'toll', 'super', 'perfekt', 'optimal', 'top', 'beste', 'besten'], ['Dramaturgie', 'Gut für wen? Das klären wir zuerst. Danach lässt sich jedes Detail daran prüfen.']],
  [['billig', 'billiger'], ['Tonalität', 'Billig wirkt selten günstig. Klare Preise und ein kurzer Weg zur Anfrage bringen mehr.']],
  [['ki', 'ai', 'chatgpt', 'claude', 'gpt', 'künstliche intelligenz'], ['Werkzeug', 'Ein Werkzeug, kein Stil. Entscheidend bleibt, was Ihre Kundschaft am Ende spürt.']],
  [['lol', 'haha', 'hahaha', 'hihi', 'xd', 'rofl'], ['Tonalität', 'Humor ist eine Tonalität mit strengen Regeln: kurze Sätze, gutes Timing, ein Witz pro Seite.']],
  [['geld', 'reich', 'umsatz', 'gewinn', 'kohle', 'millionen'], ['Dramaturgie', 'Umsatz folgt auf Vertrauen. Belege wie Projekte und Stimmen Ihrer Kundschaft kommen deshalb ganz nach oben.']],
  [['ja', 'nein', 'ok', 'okay', 'vielleicht', 'jein'], ['Im Gespräch', 'Eine klare Antwort. Fehlt nur noch die Frage dazu: Wie soll Ihr Unternehmen wirken?']],
  [['wort', 'ein wort', 'adjektiv', 'irgendein wort'], ['Wörtlich', 'Sehr wörtlich genommen. Gemeint ist ein Wort wie seriöser oder lebendiger.']],
  [['apple', 'google', 'nike', 'tesla', 'amazon', 'porsche', 'coca cola', 'ikea'], ['Vorbild', 'Ein großes Vorbild. Dessen Kern ist ein einziger Gedanke, jahrzehntelang wiederholt. Ihren Gedanken finden wir im Erstgespräch.']],
  [['limburg', 'lahn', 'hessen', 'mittelhessen', 'wiesbaden', 'frankfurt', 'gießen', 'wetzlar', 'weilburg'], ['Bildsprache', 'Gute Gegend, ich komme gern vorbei. Und wie soll Ihr Unternehmen dort wirken?']],
  [['wirken'], ['Wörtlich', 'Genau darum geht es. Fehlt nur noch das Wie, zum Beispiel ruhiger oder lebendiger.']],
]

export const GROB: Antwort[] = [
  ['Tonalität', 'Deutlich ist gut, druckreif ist besser. Versuchen Sie es mit einem Wort, das auch auf Ihrer Website stehen darf.'],
  ['Tonalität', 'Dieses Wort bleibt draußen. Ihr Briefing verdient eines, das Ihre Kundschaft gern liest.'],
  ['Tonalität', 'Klare Ansage. Für Ihren Auftritt wählen wir trotzdem eine andere Tonlage.'],
]
export const ZAHL: Antwort = ['Belege', 'Zahlen mag ich, als Beleg im Text. Für den Dekodierer brauche ich ein Wort, zum Beispiel seriöser.']
export const ZWEIUNDVIERZIG: Antwort = ['Antwort', 'Die Antwort auf alles. Die passende Frage dazu klären wir im Erstgespräch.']
export const ZEICHEN: Antwort = ['Bildsprache', 'Ein Bild sagt viel, dieses hier noch zu wenig. Versuchen Sie es mit einem Wort.']
export const BUCHSTABE: Antwort = ['Typografie', 'Ein Buchstabe ist ein Anfang. Für eine Entscheidung brauche ich ein ganzes Wort.']
export const SALAT: Antwort[] = [
  ['Typografie', 'Als Schriftmuster brauchbar, als Briefing noch offen. Ein echtes Wort, bitte.'],
  ['Probelauf', 'Das klingt nach einem Spaziergang über die Tastatur. Welches Wort war gemeint?'],
]
export const LANG: Antwort = ['Im Gespräch', 'Das ist schon ein halbes Briefing. Bringen Sie es ins Erstgespräch mit, dort hat es Platz.']
export const UNBEKANNT: Antwort[] = [
  ['Im Gespräch', 'Dieses Wort fehlt noch in meiner Liste. Bringen Sie es ins Erstgespräch mit.'],
  ['Im Gespräch', 'Für dieses Wort gibt es noch keine fertige Übersetzung. Genau solche Wörter klären wir im Erstgespräch.'],
  ['Im Gespräch', 'Ein neues Wort für meine Liste. Im Erstgespräch übersetzen wir es gemeinsam.'],
]
