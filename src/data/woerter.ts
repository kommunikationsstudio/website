// Wörter, die Besuchende oben in den Dekodierer tippen können.
// Je Eintrag: Wortstämme (klein, ohne Endung), Kategorie, Übersetzung.
// Die Stämme werden im Browser gegen die Eingabe ohne Steigerungsendung geprüft.
export const WOERTER: [string[], string, string][] = [
  [['modern'], 'Typografie', 'Die Schrift wechselt zur Grotesk. Klarheit steht vor Tradition.'],
  [['zeitgemäß', 'aktuell'], 'Typografie', 'Ein Raster und eine Schrift, die auch in fünf Jahren tragen.'],
  [['elegant', 'stilvoll'], 'Typografie', 'Eine Serifenschrift mit feinem Kontrast, großzügig gesetzt.'],
  [['auffällig', 'laut', 'stark', 'groß', 'größ', 'präsent', 'präsenz', 'sichtbarkeit'], 'Typografie', 'Große Schriftsprünge und ein Zeichen, das auch winzig funktioniert.'],
  [['emotional', 'gefühlvoll', 'emotion', 'gefühl'], 'Bildsprache', 'Eigene Aufnahmen bei Tageslicht. Menschen statt Symbolbilder.'],
  [['menschlich', 'nahbar', 'persönlich', 'sympathisch', 'familiär', 'herzlich'], 'Bildsprache', 'Gesichter aus Ihrem Team, fotografiert dort, wo sie arbeiten.'],
  [['authentisch', 'echt', 'natürlich'], 'Bildsprache', 'Dokumentarische Fotos statt Inszenierung. Echte Räume, echte Arbeit.'],
  [['regional', 'bodenständig', 'traditionell', 'heimatverbunden', 'tradition', 'heimat'], 'Bildsprache', 'Orte und Menschen aus Ihrer Region, die Ihre Kundschaft wiedererkennt.'],
  [['lebendig', 'dynamisch', 'bewegt', 'spannend', 'dynamik', 'bewegung'], 'Bewegung', 'Eine einzige Bewegung, die zeigt, worauf es ankommt.'],
  [['professionell', 'kompetent', 'souverän', 'erfahren'], 'Tonalität', 'Kurze Hauptsätze, Sie-Ansprache, jedes Wort mit einer Aufgabe.'],
  [['seriös', 'vertrauenswürdig', 'sicher', 'ehrlich', 'transparent', 'glaubwürdig', 'zuverlässig', 'vertrauen', 'seriosität'], 'Tonalität', 'Belegbare Aussagen statt Versprechen. Zahlen, Namen, Zeiträume.'],
  [['jung', 'jüng', 'hip', 'cool', 'lässig', 'locker'], 'Tonalität', 'Direkte Ansprache und Bilder aus dem Alltag Ihrer Zielgruppe.'],
  [['nachhaltig', 'grün', 'ökologisch'], 'Tonalität', 'Konkrete Zahlen zu Material und Wegen statt grüner Symbole.'],
  [['international', 'global', 'weltoffen'], 'Tonalität', 'Eine zweite Sprache, die dieselbe Haltung trägt.'],
  [['günstig', 'preiswert', 'bezahlbar'], 'Tonalität', 'Klare Preise und kurze Wege statt Rabattsprache.'],
  [['innovativ', 'kreativ', 'mutig', 'einzigartig', 'besonder', 'anders', 'individuell', 'unverwechselbar', 'mut', 'kreativität', 'innovation'], 'Dramaturgie', 'Ein klarer Gedanke, den nur Sie so sagen können, ganz am Anfang.'],
  [['klar', 'aufgeräumt', 'clean', 'minimalistisch', 'strukturiert', 'übersichtlich', 'einfach', 'klarheit', 'struktur'], 'Dramaturgie', 'Eine Reihenfolge, in der Ihr Gegenüber Sie Schritt für Schritt kennenlernt.'],
  [['digital', 'online'], 'Dramaturgie', 'Eine Website, die durch Ihr Angebot führt, statt es aufzulisten.'],
  [['hochwertig', 'wertig', 'qualität'], 'Atmosphäre', 'Weniger Elemente, mehr Raum, ein einziges Raster für alles.'],
  [['premium', 'edel', 'edl', 'luxuriös', 'exklusiv', 'teur', 'teuer', 'gehoben', 'luxus', 'exklusivität'], 'Atmosphäre', 'Ruhe statt Fülle. Jedes Element bekommt Platz und einen Grund.'],
  [['warm', 'wärm', 'gemütlich', 'einladend', 'wärme'], 'Atmosphäre', 'Weiches Licht, natürliche Materialien, mehr Raum um jedes Bild.'],
  [['schön', 'ansprechend', 'attraktiv', 'hübsch'], 'Atmosphäre', 'Zuerst klären wir, für wen. Dann entscheidet jedes Detail für diese Menschen.'],
  [['frisch', 'neu', 'peppig'], 'Rhythmus', 'Pausen dort, wo Ihr Angebot Gewicht braucht.'],
  [['ruhig', 'gelassen', 'entspannt', 'ruhe'], 'Rhythmus', 'Lange stille Flächen, wenige dichte Momente.'],
]
