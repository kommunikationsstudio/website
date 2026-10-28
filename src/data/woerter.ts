// Wörter, die Besuchende oben in den Dekodierer tippen können.
// Je Eintrag: Wortstämme (klein, ohne Endung), Kategorie, Übersetzung.
// Die Stämme werden im Browser gegen die Eingabe ohne Steigerungsendung geprüft.
export const WOERTER: [string[], string, string][] = [
  [['modern'], 'Typografie', 'Eine Grotesk in zwei Schnitten, groß gesetzt und mit viel Abstand.'],
  [['zeitgemäß', 'aktuell'], 'Typografie', 'Ein Raster und eine Schrift, die auch in fünf Jahren tragen.'],
  [['elegant', 'stilvoll'], 'Typografie', 'Feine Strichstärken, wenige Schriftgrößen und viel Weißraum.'],
  [['auffällig', 'laut', 'stark', 'groß', 'größ', 'präsent', 'präsenz', 'sichtbarkeit'], 'Typografie', 'Große Schriftsprünge und ein Zeichen, das auch winzig funktioniert.'],
  [['emotional', 'gefühlvoll', 'emotion', 'gefühl'], 'Bildsprache', 'Eigene Aufnahmen bei Tageslicht, nah an den Menschen, die bei Ihnen arbeiten.'],
  [['menschlich', 'nahbar', 'persönlich', 'sympathisch', 'familiär', 'herzlich'], 'Bildsprache', 'Gesichter aus Ihrem Team, fotografiert dort, wo sie arbeiten.'],
  [['authentisch', 'echt', 'natürlich'], 'Bildsprache', 'Dokumentarische Fotos aus Ihren Räumen, mitten im Arbeitstag.'],
  [['regional', 'bodenständig', 'traditionell', 'heimatverbunden', 'tradition', 'heimat'], 'Bildsprache', 'Orte und Menschen aus Ihrer Region, die Ihre Kundschaft wiedererkennt.'],
  [['lebendig', 'dynamisch', 'bewegt', 'spannend', 'dynamik', 'bewegung'], 'Bewegung', 'Bewegung genau dort, wo sie einen Ablauf erklärt.'],
  [['professionell', 'kompetent', 'souverän', 'erfahren'], 'Tonalität', 'Kurze Hauptsätze in der Sie-Form. Fachbegriffe nur dort, wo Ihre Kundschaft sie selbst benutzt.'],
  [['seriös', 'vertrauenswürdig', 'sicher', 'ehrlich', 'transparent', 'glaubwürdig', 'zuverlässig', 'vertrauen', 'seriosität'], 'Tonalität', 'Jede Aussage mit einem Beleg, etwa einer Jahreszahl oder einem Projekt.'],
  [['jung', 'jüng', 'hip', 'cool', 'lässig', 'locker'], 'Tonalität', 'Direkte Ansprache und Bilder aus dem Alltag Ihrer Zielgruppe.'],
  [['nachhaltig', 'grün', 'ökologisch'], 'Tonalität', 'Konkrete Zahlen zu Material und Transportwegen, belegt und datiert.'],
  [['international', 'global', 'weltoffen'], 'Tonalität', 'Eine zweite Sprache, die dieselbe Haltung trägt.'],
  [['günstig', 'preiswert', 'bezahlbar'], 'Tonalität', 'Klare Preise und ein kurzer Weg bis zur Anfrage.'],
  [['innovativ', 'kreativ', 'mutig', 'einzigartig', 'besonder', 'anders', 'individuell', 'unverwechselbar', 'mut', 'kreativität', 'innovation'], 'Dramaturgie', 'Ein klarer Gedanke, den nur Sie so sagen können, ganz am Anfang.'],
  [['klar', 'aufgeräumt', 'clean', 'minimalistisch', 'strukturiert', 'übersichtlich', 'einfach', 'klarheit', 'struktur'], 'Dramaturgie', 'Ein Gedanke pro Abschnitt, in einer festen Reihenfolge.'],
  [['digital', 'online'], 'Dramaturgie', 'Eine Website, die Ihre Besucher in wenigen Schritten zur Anfrage führt.'],
  [['hochwertig', 'wertig', 'qualität'], 'Atmosphäre', 'Wenige Elemente auf einem festen Raster, mit Raum um jedes einzelne.'],
  [['premium', 'edel', 'edl', 'luxuriös', 'exklusiv', 'teur', 'teuer', 'gehoben', 'luxus', 'exklusivität'], 'Atmosphäre', 'Wenige Elemente mit viel Raum. Jedes davon hat einen Grund.'],
  [['warm', 'wärm', 'gemütlich', 'einladend', 'wärme'], 'Atmosphäre', 'Weiches Licht, natürliche Materialien, mehr Raum um jedes Bild.'],
  [['schön', 'ansprechend', 'attraktiv', 'hübsch'], 'Atmosphäre', 'Zuerst klären wir, für wen. Dann entscheidet jedes Detail für diese Menschen.'],
  [['frisch', 'neu', 'peppig'], 'Rhythmus', 'Lange Pausen vor Ihrem wichtigsten Angebot, dichte Passagen danach.'],
  [['ruhig', 'gelassen', 'entspannt', 'ruhe'], 'Rhythmus', 'Lange stille Flächen, wenige dichte Momente.'],
]
