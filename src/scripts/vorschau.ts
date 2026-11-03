// Vorschau, solange die Website hinter dem Passwort liegt: eine Wolke aus
// Punkten, die zwischen Formen wandert und am Ende das Zeichen k·s bildet.
// Alles läuft auf der Grafikkarte; JavaScript liefert nur Zielpositionen und Zeit.
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Clock,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'

const leinwand = document.querySelector<HTMLCanvasElement>('[data-buehne]')
const anzeige = document.querySelector<HTMLElement>('[data-zustand]')
const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches
const klein = matchMedia('(max-width: 760px)').matches
const ANZAHL = klein ? 42000 : 90000

type Form = { name: string; punkte: Float32Array }

function zufall(seed: number) {
  // Reproduzierbar, damit jeder Besuch dieselbe Wolke sieht.
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}

function nebel(): Float32Array {
  const z = zufall(7)
  const p = new Float32Array(ANZAHL * 3)
  for (let i = 0; i < ANZAHL; i++) {
    const r = Math.pow(z(), 0.6) * 3.4
    const t = z() * Math.PI * 2
    const u = z() * 2 - 1
    const s = Math.sqrt(1 - u * u)
    p.set([r * s * Math.cos(t) * 1.5, r * u * 0.8, r * s * Math.sin(t)], i * 3)
  }
  return p
}

function kugel(): Float32Array {
  const z = zufall(11)
  const p = new Float32Array(ANZAHL * 3)
  const gold = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < ANZAHL; i++) {
    const y = 1 - (i / (ANZAHL - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const t = gold * i
    const d = 1.75 + (z() - 0.5) * 0.06
    p.set([Math.cos(t) * r * d, y * d, Math.sin(t) * r * d], i * 3)
  }
  return p
}

function knoten(): Float32Array {
  const z = zufall(23)
  const p = new Float32Array(ANZAHL * 3)
  const P = 2, Q = 3
  for (let i = 0; i < ANZAHL; i++) {
    const t = (i / ANZAHL) * Math.PI * 2
    const r = 1.1 + 0.45 * Math.cos(Q * t)
    const c = new Vector3(r * Math.cos(P * t), r * Math.sin(P * t), 0.45 * Math.sin(Q * t))
    // Ein dünner Schlauch um die Kurve, damit der Knoten Körper bekommt.
    const w = z() * Math.PI * 2
    const a = 0.16 * Math.sqrt(z())
    p.set([c.x + Math.cos(w) * a, c.y + Math.sin(w) * a, c.z + (z() - 0.5) * a * 2], i * 3)
  }
  return p
}

async function zeichen(): Promise<Float32Array> {
  // Das Signet kommt aus Sebastians Vorlage (logo-ks-master.svg), nicht aus
  // einer nachgesetzten Schrift: Markenzeichen gestaltet er selbst. Gezeichnet
  // wird nur der linke Teil mit dem Zeichen, jeder Punkt sucht sich ein Pixel davon.
  const bild = new Image()
  bild.src = '/logo-ks-master.svg'
  await bild.decode()
  const MASS = 4 // Pixel je Einheit der viewBox
  const breite = 225, hoehe = 255.12 // linker Ausschnitt der viewBox 1073.1 × 255.12
  const c = document.createElement('canvas')
  c.width = breite * MASS
  c.height = Math.round(hoehe * MASS)
  const g = c.getContext('2d', { willReadFrequently: true })!
  g.drawImage(bild, 0, 0, 1073.1 * MASS, hoehe * MASS)
  const daten = g.getImageData(0, 0, c.width, c.height).data
  const treffer: number[] = []
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
  for (let y = 0; y < c.height; y += 2) {
    for (let x = 0; x < c.width; x += 2) {
      if (daten[(y * c.width + x) * 4 + 3] > 128) {
        treffer.push(x, y)
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y)
      }
    }
  }
  const z = zufall(31)
  const p = new Float32Array(ANZAHL * 3)
  const n = treffer.length / 2
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2
  const skala = 2.1 / (y1 - y0)
  for (let i = 0; i < ANZAHL; i++) {
    const k = Math.floor(z() * n) * 2
    p.set([(treffer[k] - mx + z() * 2) * skala, -(treffer[k + 1] - my + z() * 2) * skala, (z() - 0.5) * 0.35], i * 3)
  }
  return p
}

const VERTEX = /* glsl */ `
  attribute vec3 aVon;
  attribute vec3 aNach;
  attribute float aZufall;
  uniform float uT;
  uniform float uZeit;
  uniform vec3 uMaus;
  uniform float uStoss;
  uniform float uPixel;
  varying float vNah;

  // Kompaktes Wertrauschen; reicht für die Verwirbelung beim Übergang.
  float h(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float n(vec3 p){
    vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
    return mix(mix(mix(h(i), h(i+vec3(1,0,0)), f.x), mix(h(i+vec3(0,1,0)), h(i+vec3(1,1,0)), f.x), f.y),
               mix(mix(h(i+vec3(0,0,1)), h(i+vec3(1,0,1)), f.x), mix(h(i+vec3(0,1,1)), h(i+vec3(1,1,1)), f.x), f.y), f.z);
  }

  void main(){
    float t = clamp(uT * 1.5 - aZufall * 0.5, 0.0, 1.0);
    t = t < 0.5 ? 4.0*t*t*t : 1.0 - pow(-2.0*t + 2.0, 3.0) / 2.0;
    vec3 p = mix(aVon, aNach, t);

    // Unterwegs wirbeln die Punkte; angekommen atmen sie nur noch.
    float weg = sin(t * 3.14159);
    vec3 q = p * 0.7 + uZeit * 0.15;
    p += (vec3(n(q), n(q + 17.0), n(q + 41.0)) - 0.5) * (weg * 1.6 + 0.05);

    // Die Maus schiebt die Wolke beiseite, ein Klick stößt sie auseinander.
    vec2 d = p.xy - uMaus.xy;
    float a = exp(-dot(d, d) * 2.2);
    p.xy += normalize(d + 1e-4) * a * (0.55 + uStoss * 1.4);
    p += normalize(p + 1e-4) * uStoss * aZufall * 0.8;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vNah = clamp(1.0 - (-mv.z - 3.0) / 7.0, 0.0, 1.0);
    gl_PointSize = uPixel * (0.6 + aZufall * 1.1) * (5.5 / -mv.z);
  }
`

const FRAGMENT = /* glsl */ `
  varying float vNah;
  void main(){
    vec2 c = gl_PointCoord - 0.5;
    float r = dot(c, c);
    if (r > 0.25) discard;
    float k = smoothstep(0.25, 0.0, r);
    gl_FragColor = vec4(vec3(1.0), k * (0.07 + vNah * 0.33));
  }
`

async function start() {
  if (!leinwand) return
  let maler: WebGLRenderer
  try {
    maler = new WebGLRenderer({ canvas: leinwand, antialias: false, alpha: false, powerPreference: 'high-performance' })
  } catch {
    document.documentElement.classList.add('ohne-3d')
    return
  }
  const dichte = Math.min(devicePixelRatio, 2)
  maler.setPixelRatio(dichte)
  maler.setClearColor(0x000000, 1)

  const szene = new Scene()
  const kamera = new PerspectiveCamera(45, 1, 0.1, 50)
  kamera.position.set(0, 0, 7.5)

  const formen: Form[] = [
    { name: 'eindruck', punkte: nebel() },
    { name: 'ordnung', punkte: kugel() },
    { name: 'spannung', punkte: knoten() },
    { name: 'wirkung', punkte: await zeichen() },
  ]

  const geo = new BufferGeometry()
  const zuf = new Float32Array(ANZAHL)
  const z = zufall(3)
  for (let i = 0; i < ANZAHL; i++) zuf[i] = z()
  geo.setAttribute('position', new BufferAttribute(new Float32Array(ANZAHL * 3), 3))
  geo.setAttribute('aVon', new BufferAttribute(formen[0].punkte.slice(), 3))
  geo.setAttribute('aNach', new BufferAttribute(formen[1].punkte.slice(), 3))
  geo.setAttribute('aZufall', new BufferAttribute(zuf, 1))

  const stoff = new ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uT: { value: 0 },
      uZeit: { value: 0 },
      uMaus: { value: new Vector3(99, 99, 0) },
      uStoss: { value: 0 },
      uPixel: { value: (klein ? 3.2 : 2.2) * dichte },
    },
  })
  const wolke = new Points(geo, stoff)
  wolke.frustumCulled = false
  szene.add(wolke)

  const groesse = () => {
    const b = innerWidth, h = innerHeight
    maler.setSize(b, h, false)
    kamera.aspect = b / h
    // Auf schmalen Schirmen weiter zurück, damit das Zeichen ganz ins Bild passt.
    kamera.position.z = b / h < 0.8 ? 11 : 7.5
    // Die Wolke sitzt über der Schrift, nicht dahinter.
    wolke.position.y = b / h < 0.8 ? 1.9 : 1.3
    kamera.updateProjectionMatrix()
  }
  groesse()
  addEventListener('resize', groesse)

  const maus = new Vector2(99, 99)
  const ziel = new Vector2(0, 0)
  addEventListener('pointermove', (e) => {
    ziel.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1)
  })
  addEventListener('pointerleave', () => ziel.set(99, 99))
  addEventListener('pointerdown', (e) => {
    if ((e.target as HTMLElement).closest('a')) return
    stoff.uniforms.uStoss.value = 1
  })

  // Wo der Zeiger die Ebene durch die Wolkenmitte trifft.
  const ebene = (v: Vector2) => {
    if (Math.abs(v.x) > 5) return new Vector3(99, 99, 0)
    const p = new Vector3(v.x, v.y, 0.5).unproject(kamera).sub(kamera.position).normalize()
    const s = -kamera.position.z / p.z
    return kamera.position.clone().add(p.multiplyScalar(s))
  }

  let jetzt = 0
  const zeigen = (i: number) => {
    if (anzeige) anzeige.textContent = `0${i + 1} / 0${formen.length}  ${formen[i].name}`
  }

  if (ruhig) {
    geo.attributes.aVon.array.set(formen[3].punkte)
    geo.attributes.aNach.array.set(formen[3].punkte)
    geo.attributes.aVon.needsUpdate = geo.attributes.aNach.needsUpdate = true
    stoff.uniforms.uT.value = 1
    zeigen(3)
    maler.render(szene, kamera)
    addEventListener('resize', () => maler.render(szene, kamera))
    return
  }

  const uhr = new Clock()
  const DAUER = 6.5
  let phase = 0
  zeigen(1)
  const schritt = () => {
    const dt = Math.min(uhr.getDelta(), 0.05)
    const zeit = uhr.elapsedTime
    phase += dt
    // Das Zeichen bleibt länger stehen als die Zwischenformen.
    const halten = formen[(jetzt + 1) % formen.length].name === 'wirkung' ? DAUER * 1.8 : DAUER
    if (phase > halten) {
      phase = 0
      jetzt = (jetzt + 1) % formen.length
      const nach = (jetzt + 1) % formen.length
      geo.attributes.aVon.array.set(geo.attributes.aNach.array)
      geo.attributes.aNach.array.set(formen[nach].punkte)
      geo.attributes.aVon.needsUpdate = geo.attributes.aNach.needsUpdate = true
      zeigen(nach)
    }
    stoff.uniforms.uT.value = Math.min(phase / 3.2, 1)
    stoff.uniforms.uZeit.value = zeit
    stoff.uniforms.uStoss.value *= 0.94

    maus.lerp(ziel.x > 5 ? new Vector2(99, 99) : ziel, ziel.x > 5 ? 1 : 0.12)
    stoff.uniforms.uMaus.value.copy(ebene(maus)).sub(wolke.position)

    // Die Wolke dreht sich langsam; die Kamera folgt dem Zeiger ein wenig.
    wolke.rotation.y = Math.sin(zeit * 0.12) * 0.5
    wolke.rotation.x = Math.sin(zeit * 0.09) * 0.15
    const zx = ziel.x > 5 ? 0 : ziel.x, zy = ziel.y > 5 ? 0 : ziel.y
    kamera.position.x += (zx * 0.6 - kamera.position.x) * 0.04
    kamera.position.y += (zy * 0.4 - kamera.position.y) * 0.04
    kamera.lookAt(0, 0, 0)

    maler.render(szene, kamera)
    requestAnimationFrame(schritt)
  }
  document.documentElement.classList.add('lebt')
  requestAnimationFrame(schritt)
}

start()
