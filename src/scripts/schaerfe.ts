// Bühne oben: die Worte erscheinen zuerst unscharf, wie ein erster Eindruck.
// Mauszeiger und Scrollen stellen sie scharf. Reines WebGL, ohne Bibliothek.

const VERTEX = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }
`

const FRAGMENT = `
precision highp float;
uniform sampler2D uText;
uniform vec2 uRes;
uniform vec2 uMaus;
uniform float uZeit;
uniform float uSchaerfe;
uniform float uLinse;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main() {
  float asp = uRes.x / uRes.y;
  vec2 p = vec2(vUv.x * asp, vUv.y);
  vec2 m = vec2(uMaus.x * asp, uMaus.y);

  // Linse um den Zeiger: innen scharf, zum Rand weich auslaufend
  float linse = (1.0 - smoothstep(0.06, 0.34, distance(p, m))) * uLinse;
  float s = clamp(max(uSchaerfe, linse), 0.0, 1.0);
  float u = 1.0 - s;

  // Fließende Verzerrung, die mit der Schärfe verschwindet
  vec2 flow = vec2(fbm(p * 2.1 + vec2(uZeit * 0.05, 0.0)), fbm(p * 2.1 + vec2(3.7, uZeit * 0.06))) - 0.5;
  vec2 st = vUv + flow * 0.07 * u;

  // Unschärfe als Scheibe von Abtastpunkten
  float r = 0.022 * u;
  float c = 0.0;
  for (int i = 0; i < 24; i++) {
    float fi = float(i);
    float a = fi * 2.39996;
    float rr = sqrt((fi + 0.5) / 24.0) * r;
    c += texture2D(uText, st + vec2(cos(a) / asp, sin(a)) * rr).r;
  }
  c /= 24.0;

  float nebel = fbm(p * 1.4 + vec2(uZeit * 0.02, -uZeit * 0.015)) * 0.16 * u;
  float hell = mix(0.62, 1.0, s);
  float col = mix(nebel, hell, c);

  // Filmkorn
  col += (hash(vUv * uRes + fract(uZeit * 7.0) * 91.0) - 0.5) * (0.05 + 0.07 * u);
  gl_FragColor = vec4(vec3(col), 1.0);
}
`

export interface Buehne {
  setSchaerfe(wert: number): void
  stop(): void
}

export function schaerfe(canvas: HTMLCanvasElement, zeilen: string[], ruhig: boolean): Buehne | null {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' })
  if (!gl) return null

  const shader = (typ: number, quelle: string) => {
    const sh = gl.createShader(typ)!
    gl.shaderSource(sh, quelle)
    gl.compileShader(sh)
    return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null
  }
  const vs = shader(gl.VERTEX_SHADER, VERTEX)
  const fs = shader(gl.FRAGMENT_SHADER, FRAGMENT)
  if (!vs || !fs) return null
  const prog = gl.createProgram()!
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  gl.useProgram(prog)

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  const aPos = gl.getAttribLocation(prog, 'aPos')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

  const ort = (n: string) => gl.getUniformLocation(prog, n)
  const uRes = ort('uRes'), uMaus = ort('uMaus'), uZeit = ort('uZeit')
  const uSchaerfe = ort('uSchaerfe'), uLinse = ort('uLinse')

  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  const tafel = document.createElement('canvas')
  const ctx = tafel.getContext('2d')!

  // Schrift auf die Tafel setzen: linksbündig, die längste Zeile füllt die Breite
  function setzen(w: number, h: number) {
    tafel.width = w
    tafel.height = h
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#fff'
    ctx.textBaseline = 'alphabetic'
    const rand = Math.max(20, w * 0.045)
    ctx.font = `900 100px Archivo`
    const breite = Math.max(...zeilen.map((z) => ctx.measureText(z).width))
    let groesse = ((w - rand * 2) / breite) * 100
    groesse = Math.min(groesse, (h * 0.62) / (zeilen.length * 0.86))
    ctx.font = `900 ${groesse}px Archivo`
    const zeilenhoehe = groesse * 0.86
    const block = zeilenhoehe * zeilen.length
    const oben = (h - block) / 2 + groesse * 0.74
    zeilen.forEach((z, i) => ctx.fillText(z, rand - groesse * 0.04, oben + i * zeilenhoehe))
    gl!.bindTexture(gl!.TEXTURE_2D, tex)
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.LUMINANCE, gl!.LUMINANCE, gl!.UNSIGNED_BYTE, tafel)
  }

  let breite = 0, hoehe = 0
  function groesse() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr)
    if (w === breite && h === hoehe) return
    breite = w
    hoehe = h
    canvas.width = w
    canvas.height = h
    gl!.viewport(0, 0, w, h)
    gl!.uniform2f(uRes, w, h)
    setzen(w, h)
  }

  // Zeiger: weich nachgeführt; ohne Maus wandert die Linse von selbst
  const ziel = { x: 0.5, y: 0.5 }, maus = { x: 0.5, y: 0.5 }
  let linse = 0, linseZiel = 0, letzteBewegung = -1e9, schaerfeWert = 0
  const fein = matchMedia('(pointer: fine)').matches
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect()
    ziel.x = (e.clientX - r.left) / r.width
    ziel.y = 1 - (e.clientY - r.top) / r.height
    letzteBewegung = performance.now()
  })
  canvas.addEventListener('pointerleave', () => { letzteBewegung = -1e9 })

  let sichtbar = true, laufend = true, rahmen = 0
  const start = performance.now()
  function zeichnen(jetzt: number) {
    const t = (jetzt - start) / 1000
    groesse()
    const aktiv = jetzt - letzteBewegung < 2500
    if (!aktiv && !fein) {
      ziel.x = 0.5 + Math.sin(t * 0.33) * 0.34
      ziel.y = 0.5 + Math.sin(t * 0.51 + 1.2) * 0.2
    }
    linseZiel = aktiv || !fein ? 1 : 0
    maus.x += (ziel.x - maus.x) * 0.08
    maus.y += (ziel.y - maus.y) * 0.08
    linse += (linseZiel - linse) * 0.05
    gl!.uniform2f(uMaus, maus.x, maus.y)
    gl!.uniform1f(uZeit, ruhig ? 0 : t)
    gl!.uniform1f(uSchaerfe, ruhig ? 1 : schaerfeWert)
    gl!.uniform1f(uLinse, ruhig ? 0 : linse)
    gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
    rahmen = laufend && sichtbar && !ruhig ? requestAnimationFrame(zeichnen) : 0
  }

  new IntersectionObserver(([e]) => {
    sichtbar = e.isIntersecting
    if (sichtbar && laufend && !rahmen && !ruhig) rahmen = requestAnimationFrame(zeichnen)
  }).observe(canvas)
  window.addEventListener('resize', () => { if (ruhig) requestAnimationFrame(zeichnen) })

  requestAnimationFrame(zeichnen)
  return {
    setSchaerfe(wert) { schaerfeWert = wert },
    stop() { laufend = false; cancelAnimationFrame(rahmen) },
  }
}
