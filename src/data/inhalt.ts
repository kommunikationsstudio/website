// Inhalte der Startseite.

export const MAIL = 'kontakt@kommunikations.studio'
export const TEL = '+4915678540600'
export const TEL_ANZEIGE = '0156 78540600'
export const MAIL_LINK = `mailto:${MAIL}?subject=${encodeURIComponent('Erstgespräch')}&body=${encodeURIComponent('Guten Tag Herr Knust,\n\nunser Unternehmen:\nunsere Website:\nworum es geht:\n\nViele Grüße\n')}`

export const MOTTO = 'vom eindruck zur wirkung.'
export const WOFUER = 'Positionierung, Erscheinungsbild und Inhalte für Unternehmen in Rhein-Main und Mittelhessen.'
export const AUSSAGE = 'Briefings sprechen in Wünschen. Ich übersetze jeden Wunsch in eine Entscheidung über Schrift, Bild, Sprache und Bewegung. So zeigt Ihr Auftritt, was Ihr Unternehmen kann.'

// art bestimmt, wie das Wort sich in der Achsen-Bühne selbst vorführt
export const KATEGORIEN = [
  { kat: 'Typografie', art: 'typografie', vor: '„Wir wollen ', wort: 'moderner', nach: ' wirken.“', antwort: 'Die Schrift wechselt zur Grotesk. Klarheit steht vor Tradition.', frage: 'Welche Schrift trägt Ihre Haltung, und in welchem Maß?' },
  { kat: 'Bildsprache', art: 'bildsprache', vor: '„Bitte etwas ', wort: 'emotionaler', nach: '.“', antwort: 'Eigene Aufnahmen bei Tageslicht. Menschen statt Symbolbilder.', frage: 'Was zeigen Sie, in welchem Licht, aus welcher Nähe?' },
  { kat: 'Bewegung', art: 'bewegung', vor: '„Die Seite soll ', wort: 'lebendiger', nach: ' sein.“', antwort: 'Eine einzige Bewegung, die zeigt, worauf es ankommt.', frage: 'Wo hilft Bewegung beim Verstehen?' },
  { kat: 'Tonalität', art: 'tonalitaet', vor: '„Wir müssen ', wort: 'professioneller', nach: ' klingen.“', antwort: 'Kurze Hauptsätze, Sie-Ansprache, jedes Wort mit einer Aufgabe.', frage: 'Wie klingt Ihr Unternehmen, wenn es spricht?' },
  { kat: 'Dramaturgie', art: 'dramaturgie', vor: '„', wort: 'Alles', nach: ' soll auf die Startseite.“', antwort: 'Eine Reihenfolge, in der Ihr Gegenüber Sie Schritt für Schritt kennenlernt.', frage: 'In welcher Reihenfolge lernt Ihr Gegenüber Sie kennen?' },
  { kat: 'Atmosphäre', art: 'atmosphaere', vor: '„Es soll ', wort: 'hochwertiger', nach: ' aussehen.“', antwort: 'Weniger Elemente, mehr Raum, ein einziges Raster für alles.', frage: 'Welches Klima bleibt nach dem ersten Besuch?' },
  { kat: 'Rhythmus', art: 'rhythmus', vor: '„Wir brauchen einen ', wort: 'frischen', nach: ' Auftritt.“', antwort: 'Pausen dort, wo Ihr Angebot Gewicht braucht.', frage: 'Wo braucht es Pause, wo Verdichtung?' },
]

export const FELDER = [
  { titel: 'positionierung', text: 'Wofür Sie stehen, für wen Sie arbeiten, was Sie unterscheidet. Ich formuliere es so klar, dass jede weitere Entscheidung daran Maß nimmt.', liefer: ['Wahrnehmungsanalyse', 'Positionierung und Markenkern', 'Sprachleitfaden'] },
  { titel: 'erscheinungsbild', text: 'Zeichen, Schrift, Raster und Bild als ein System, von der Visitenkarte bis zur Website. Entwurf und Code kommen aus einer Hand.', liefer: ['Corporate Design', 'Logo und Zeichensystem', 'Webdesign und Entwicklung'] },
  { titel: 'inhalte', text: 'Text, Fotografie und Video, die Ihre Haltung zeigen. Nach außen für Kundschaft und Bewerbende, nach innen für Ihr Team. Ich fotografiere, filme und schreibe selbst.', liefer: ['Content-Produktion', 'Employer Branding', 'Interne Kommunikation'] },
]

export const SCHRITTE = [
  { titel: 'Erstgespräch', text: '45 Minuten, kostenfrei. Wir schauen gemeinsam auf Ihren Auftritt, und Sie gehen mit drei konkreten Beobachtungen.' },
  { titel: 'Wahrnehmungsanalyse', text: 'Ich prüfe Ihren Auftritt in sieben Kategorien und halte die Antworten schriftlich fest. Sie sind der Maßstab für alles Weitere.' },
  { titel: 'Gestaltung und Umsetzung', text: 'Aus den Antworten entstehen Erscheinungsbild, Website und Inhalte. Sie sehen Zwischenstände und entscheiden mit.' },
  { titel: 'Übergabe', text: 'Sie erhalten alle Dateien und einen Leitfaden, mit dem Ihr Team den Auftritt selbst weiterführt.' },
]

export const STATIONEN = [
  ['2012', 'Aldiana in Ägypten, auf Kreta und in Andalusien: Marketing und Social Media'],
  ['2014', 'Kempinski Hotel Frankfurt Gravenbruch: Ausbildung, Sales, erste Gestaltung'],
  ['2018', 'Villa Rothschild und Falkenstein Grand: Marketing, Fotografie, Video'],
  ['2021', 'Sellwerk und Kalify: Vertrieb, Aufbau einer Markenidentität'],
  ['2022', 'Steigenberger Frankfurter Hof: Marketing Manager Luxury'],
  ['2024', 'Interne Kommunikation im öffentlichen Sektor'],
]

export const PERSON = [
  'Ich komme aus der internationalen Luxushotellerie. Dort zählt der erste Satz am Telefon so viel wie die Fassade.',
  'Dieser Maßstab gilt in meiner Arbeit bis heute. Ich habe Marken geführt, Kampagnen entwickelt und Agenturen gesteuert. Fotos, Filme und Texte produziere ich selbst.',
  'Ich arbeite mit digitalen Werkzeugen, auch mit KI. Das Urteil, wie Ihr Unternehmen wirkt, treffen wir gemeinsam.',
]

export const SCHLUSS = {
  titel: 'beginnen wir mit dem eindruck, den sie heute hinterlassen.',
  text: 'Das Erstgespräch ist kostenfrei. In 45 Minuten schauen wir gemeinsam auf Ihren Auftritt. Sie gehen mit drei konkreten Beobachtungen, ganz gleich, wie Sie danach entscheiden.',
}

export const TITEL = {
  achsen: 'sieben fragen statt eines adjektivs',
  dekodierer: 'sie sagen ein wort. ich höre eine entscheidung.',
  felder: 'drei felder, ein system',
  ablauf: 'so arbeite ich',
  person: 'wer ihnen gegenübersitzt',
}
