// Inhalte der Startseite.

export const MAIL = 'kontakt@kommunikations.studio'
export const TEL = '+4915678540600'
export const TEL_ANZEIGE = '0156 78540600'

// Buchungslinks (Google-Terminbuchung). Solange leer, öffnet der Knopf eine vorbereitete E-Mail.
export const BUCHUNG = { video: '', vorOrt: '' }
const brief = (art: string, feld: string) => `mailto:${MAIL}?subject=${encodeURIComponent(`Erstgespräch ${art}`)}&body=${encodeURIComponent(`Guten Tag Herr Knust,\n\nich wünsche mir ein Erstgespräch ${art}.\n\nunser Unternehmen:\n${feld}\nzwei Terminvorschläge:\n\nViele Grüße\n`)}`
export const TERMINE = [
  { titel: 'Video-Call', zusatz: '45 Minuten, kostenfrei', link: BUCHUNG.video || brief('per Video', 'unsere Website:'), extern: !!BUCHUNG.video },
  { titel: 'Besuch vor Ort', zusatz: 'kostenfrei, in Rhein-Main und Mittelhessen', link: BUCHUNG.vorOrt || brief('vor Ort', 'unsere Adresse:'), extern: !!BUCHUNG.vorOrt },
]

export const MOTTO = 'vom eindruck zur wirkung.'
export const WOFUER = 'Positionierung, Erscheinungsbild und Inhalte für Unternehmen in Rhein-Main und Mittelhessen.'
export const AUSSAGE = 'Briefings sprechen in Wünschen. Ich übersetze jeden davon in eine Entscheidung über Schrift, Bild, Sprache oder Bewegung, die Sie prüfen können.'

// art bestimmt, wie das Wort sich in der Achsen-Bühne selbst vorführt
export const KATEGORIEN = [
  { kat: 'Typografie', art: 'typografie', vor: '„Wir wollen ', wort: 'moderner', nach: ' wirken.“', antwort: 'Eine Grotesk in zwei Schnitten, groß gesetzt und mit viel Abstand.', frage: 'Welche Zeile liest Ihr Gegenüber zuerst?' },
  { kat: 'Bildsprache', art: 'bildsprache', vor: '„Bitte etwas ', wort: 'emotionaler', nach: '.“', antwort: 'Eigene Aufnahmen bei Tageslicht, nah an den Menschen, die bei Ihnen arbeiten.', frage: 'Was zeigen Sie, und aus welcher Nähe?' },
  { kat: 'Bewegung', art: 'bewegung', vor: '„Die Seite soll ', wort: 'lebendiger', nach: ' sein.“', antwort: 'Bewegung genau dort, wo sie einen Ablauf erklärt.', frage: 'Wo hilft Bewegung beim Verstehen?' },
  { kat: 'Tonalität', art: 'tonalitaet', vor: '„Wir müssen ', wort: 'professioneller', nach: ' klingen.“', antwort: 'Kurze Hauptsätze in der Sie-Form. Fachbegriffe nur dort, wo Ihre Kundschaft sie selbst benutzt.', frage: 'Wie klingt Ihr Unternehmen, wenn es spricht?' },
  { kat: 'Dramaturgie', art: 'dramaturgie', vor: '„', wort: 'Alles', nach: ' soll auf die Startseite.“', antwort: 'Eine Startseite mit einem Gedanken. Alles Weitere bekommt seinen Platz eine Ebene tiefer.', frage: 'In welcher Reihenfolge lernt Ihr Gegenüber Sie kennen?' },
  { kat: 'Atmosphäre', art: 'atmosphaere', vor: '„Es soll ', wort: 'hochwertiger', nach: ' aussehen.“', antwort: 'Wenige Elemente auf einem festen Raster, mit Raum um jedes einzelne.', frage: 'Welcher Eindruck bleibt nach dem ersten Besuch?' },
  { kat: 'Rhythmus', art: 'rhythmus', vor: '„Wir brauchen einen ', wort: 'frischen', nach: ' Auftritt.“', antwort: 'Lange Pausen vor Ihrem wichtigsten Angebot, dichte Passagen danach.', frage: 'Wo darf die Seite atmen, und wo wird sie dicht?' },
]

export const FELDER = [
  { titel: 'positionierung', text: 'Am Anfang steht ein Satz, der sagt, wofür Sie stehen und für wen Sie arbeiten. An ihm messen wir jede weitere Entscheidung.', liefer: ['Wahrnehmungsanalyse', 'Positionierung und Markenkern', 'Sprachleitfaden'] },
  { titel: 'erscheinungsbild', text: 'Logo, Schrift, Raster und Bildsprache folgen denselben Regeln, auf der Visitenkarte wie auf der Website. Entwurf und Code kommen aus einer Hand.', liefer: ['Corporate Design', 'Logo und Zeichensystem', 'Webdesign und Entwicklung'] },
  { titel: 'inhalte', text: 'Fotos und Filme drehe ich selbst, mit eigener Kamera und Drohne. Die Texte dazu schreibe ich auch: für Ihre Kundschaft, für Bewerbungen und für die Kommunikation im eigenen Haus.', liefer: ['Content-Produktion', 'Employer Branding', 'Interne Kommunikation'] },
]

export const SCHRITTE = [
  { titel: 'Erstgespräch', text: 'Kostenfrei, per Video oder bei Ihnen vor Ort. Wir schauen gemeinsam auf Ihren Auftritt, und Sie gehen mit drei konkreten Beobachtungen.' },
  { titel: 'Wahrnehmungsanalyse', text: 'Ich prüfe Ihren Auftritt in sieben Kategorien und halte die Antworten schriftlich fest. Jeder spätere Entwurf wird an diesem Papier gemessen.' },
  { titel: 'Gestaltung und Umsetzung', text: 'Aus den Antworten entstehen Erscheinungsbild, Website und Inhalte. Sie sehen Zwischenstände und entscheiden mit.' },
  { titel: 'Übergabe', text: 'Sie erhalten alle Dateien und einen Leitfaden, mit dem Ihr Team den Auftritt selbst weiterführt.' },
]

export const STATIONEN = [
  ['2005', 'Werbeagentur in Einbeck: erste Anzeigen für Kunden aus der Region'],
  ['2012', 'Aldiana in Ägypten, auf Kreta und in Andalusien: Marketing und Social Media, auf Kreta der Online-Auftritt eines Clubs vor seiner Eröffnung'],
  ['2014', 'Kempinski Hotel Frankfurt Gravenbruch: Ausbildung mit Zusatzqualifikation Hotelmanagement, danach Sales für Botschaften und Konsulate'],
  ['2018', 'Villa Rothschild und Falkenstein Grand: Marketing beider Häuser, eigene Fotos und Filme'],
  ['2021', 'Sellwerk: Marketinganalysen für kleine und mittlere Unternehmen'],
  ['2022', 'Steigenberger Frankfurter Hof, ab 2023 zusätzlich Parkhotel Düsseldorf: Leitung Marketing'],
  ['2024', 'Interne Kommunikation im öffentlichen Sektor'],
]

export const PERSON = [
  'Ich komme aus der internationalen Luxushotellerie. Dort zählt der erste Satz am Telefon so viel wie die Fassade.',
  'Im Steigenberger Frankfurter Hof habe ich das Marketing geleitet und die Agenturen gesteuert, ab 2023 auch für das Parkhotel in Düsseldorf. Bei Sellwerk habe ich davor den Auftritt kleiner und mittlerer Betriebe analysiert. Ich kenne also beide Seiten: das Markenhandbuch eines Konzerns und den Inhaber, der abends noch die eigene Website pflegt.',
  'Digitale Werkzeuge und KI beschleunigen meine Arbeit. Wie Ihr Unternehmen wirken soll, entscheiden wir zusammen.',
]

export const SCHLUSS = {
  titel: 'beginnen wir mit dem eindruck, den sie heute hinterlassen.',
  text: 'Im Video-Call schauen wir gemeinsam auf Ihre Website und Ihre Unterlagen. Beim Besuch komme ich zu Ihnen und erlebe Ihr Unternehmen so, wie Ihre Kundschaft es erlebt. Danach entscheiden Sie in Ruhe.',
}

export const TITEL = {
  achsen: 'sieben fragen statt eines adjektivs',
  dekodierer: 'aus einem wort wird eine entscheidung.',
  felder: 'leistungen',
  ablauf: 'so arbeite ich',
  person: 'wer ihnen gegenübersitzt',
}
