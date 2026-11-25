const DIAGRAMS = {
  gravity: `
    <svg viewBox="0 0 360 150" width="100%" height="150" role="img" aria-label="Diagram gerak jatuh bebas">
      <line x1="60" y1="20" x2="60" y2="128" stroke="#334155" stroke-width="2" stroke-dasharray="4 4"/>
      <text x="20" y="30" fill="#94a3b8" font-size="11" font-family="IBM Plex Mono, monospace">h₀</text>
      <text x="20" y="128" fill="#94a3b8" font-size="11" font-family="IBM Plex Mono, monospace">0 m</text>
      <circle cx="150" cy="34" r="14" fill="#6366f1" fill-opacity="0.25" stroke="#818cf8" stroke-width="2"/>
      <circle cx="150" cy="34" r="6" fill="#818cf8"/>
      <line x1="150" y1="54" x2="150" y2="96" stroke="#38bdf8" stroke-width="2.5"/>
      <polygon points="150,104 144,92 156,92" fill="#38bdf8"/>
      <text x="166" y="78" fill="#38bdf8" font-size="12" font-family="IBM Plex Mono, monospace">g = 9.8 m/s²</text>
      <text x="166" y="94" fill="#cbd5e1" font-size="11" font-family="IBM Plex Mono, monospace">v = g · t</text>
      <rect x="40" y="128" width="280" height="8" rx="3" fill="#10b981" fill-opacity="0.4" stroke="#10b981"/>
    </svg>
  `,
  circuit: `
    <svg viewBox="0 0 360 150" width="100%" height="150" role="img" aria-label="Diagram rangkaian listrik seri">
      <rect x="70" y="30" width="220" height="90" rx="6" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
      <rect x="58" y="56" width="24" height="38" fill="#080d1a"/>
      <line x1="60" y1="68" x2="80" y2="68" stroke="#fbbf24" stroke-width="3"/>
      <line x1="64" y1="80" x2="76" y2="80" stroke="#fbbf24" stroke-width="2"/>
      <text x="28" y="78" fill="#fbbf24" font-size="11" font-family="IBM Plex Mono, monospace">V (Volt)</text>
      <rect x="145" y="18" width="70" height="24" rx="4" fill="#172238" stroke="#818cf8" stroke-width="2"/>
      <text x="160" y="34" fill="#c7d2fe" font-size="11" font-family="IBM Plex Mono, monospace">R (Ω)</text>
      <circle cx="290" cy="75" r="16" fill="#f59e0b" fill-opacity="0.2" stroke="#fbbf24" stroke-width="2"/>
      <path d="M284 75 l6 -6 l6 6 l-6 6 z" fill="#fbbf24"/>
      <text x="314" y="78" fill="#cbd5e1" font-size="11" font-family="IBM Plex Mono, monospace">Lampu</text>
      <text x="152" y="138" fill="#34d399" font-size="11" font-family="IBM Plex Mono, monospace">I = V / R (Ampere)</text>
    </svg>
  `,
  thermo: `
    <svg viewBox="0 0 360 150" width="100%" height="150" role="img" aria-label="Diagram perpindahan kalor">
      <rect x="55" y="45" width="80" height="60" rx="8" fill="#f43f5e" fill-opacity="0.2" stroke="#fb7185" stroke-width="2"/>
      <text x="72" y="73" fill="#fecdd3" font-size="12" font-weight="700">T₁ Tinggi</text>
      <text x="75" y="90" fill="#fb7185" font-size="11" font-family="IBM Plex Mono, monospace">Q lepas</text>
      <line x1="145" y1="75" x2="205" y2="75" stroke="#fbbf24" stroke-width="3"/>
      <polygon points="215,75 201,68 201,82" fill="#fbbf24"/>
      <text x="155" y="62" fill="#fbbf24" font-size="11" font-family="IBM Plex Mono, monospace">Kalor (Q)</text>
      <rect x="225" y="45" width="80" height="60" rx="8" fill="#0ea5e9" fill-opacity="0.2" stroke="#38bdf8" stroke-width="2"/>
      <text x="240" y="73" fill="#bae6fd" font-size="12" font-weight="700">T₂ Rendah</text>
      <text x="242" y="90" fill="#38bdf8" font-size="11" font-family="IBM Plex Mono, monospace">Q terima</text>
    </svg>
  `,
  atom: `
    <svg viewBox="0 0 360 150" width="100%" height="150" role="img" aria-label="Diagram struktur atom">
      <circle cx="150" cy="75" r="12" fill="#f43f5e" fill-opacity="0.3" stroke="#fb7185" stroke-width="2"/>
      <circle cx="147" cy="73" r="3" fill="#fb7185"/>
      <circle cx="154" cy="77" r="3" fill="#94a3b8"/>
      <ellipse cx="150" cy="75" rx="58" ry="22" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
      <ellipse cx="150" cy="75" rx="58" ry="22" fill="none" stroke="#818cf8" stroke-width="1.5" transform="rotate(60 150 75)"/>
      <ellipse cx="150" cy="75" rx="58" ry="22" fill="none" stroke="#34d399" stroke-width="1.5" transform="rotate(120 150 75)"/>
      <circle cx="208" cy="75" r="4" fill="#38bdf8"/>
      <circle cx="121" cy="25" r="4" fill="#818cf8"/>
      <text x="235" y="55" fill="#fb7185" font-size="11" font-family="IBM Plex Mono, monospace">Inti: Proton + Neutron</text>
      <text x="235" y="78" fill="#38bdf8" font-size="11" font-family="IBM Plex Mono, monospace">Kulit: Elektron (−)</text>
      <text x="235" y="101" fill="#cbd5e1" font-size="11" font-family="IBM Plex Mono, monospace">A = Z + N</text>
    </svg>
  `,
  phscale: `
    <svg viewBox="0 0 360 150" width="100%" height="150" role="img" aria-label="Diagram skala pH 0 sampai 14">
      <defs>
        <linearGradient id="phGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stop-color="#f43f5e"/>
          <stop offset="50%" stop-color="#10b981"/>
          <stop offset="100%" stop-color="#6366f1"/>
        </linearGradient>
      </defs>
      <rect x="40" y="60" width="280" height="22" rx="6" fill="url(#phGrad)"/>
      <text x="40" y="48" fill="#fda4af" font-size="11" font-weight="700">Asam (pH 0–6)</text>
      <text x="155" y="48" fill="#6ee7b7" font-size="11" font-weight="700">Netral (7)</text>
      <text x="242" y="48" fill="#a5b4fc" font-size="11" font-weight="700">Basa (pH 8–14)</text>
      <text x="42" y="104" fill="#94a3b8" font-size="11" font-family="IBM Plex Mono, monospace">0</text>
      <text x="176" y="104" fill="#34d399" font-size="11" font-family="IBM Plex Mono, monospace">7</text>
      <text x="306" y="104" fill="#94a3b8" font-size="11" font-family="IBM Plex Mono, monospace">14</text>
    </svg>
  `,
  redox: `
    <svg viewBox="0 0 360 150" width="100%" height="150" role="img" aria-label="Diagram reaksi redoks">
      <rect x="45" y="45" width="90" height="58" rx="8" fill="#172238" stroke="#fbbf24" stroke-width="2"/>
      <text x="64" y="72" fill="#fde68a" font-size="12" font-weight="700">Fe (Logam)</text>
      <text x="66" y="90" fill="#94a3b8" font-size="11" font-family="IBM Plex Mono, monospace">Biloks: 0</text>
      <path d="M145 64 H210" stroke="#38bdf8" stroke-width="2"/>
      <polygon points="218,64 206,58 206,70" fill="#38bdf8"/>
      <text x="152" y="54" fill="#38bdf8" font-size="10" font-family="IBM Plex Mono, monospace">Oksidasi (-e⁻)</text>
      <rect x="225" y="45" width="95" height="58" rx="8" fill="#7c2d12" fill-opacity="0.35" stroke="#fb923c" stroke-width="2"/>
      <text x="240" y="72" fill="#fed7aa" font-size="12" font-weight="700">Fe₂O₃·nH₂O</text>
      <text x="244" y="90" fill="#fdba74" font-size="11" font-family="IBM Plex Mono, monospace">Biloks: +3</text>
    </svg>
  `,
  cell: `
    <svg viewBox="0 0 360 150" width="100%" height="150" role="img" aria-label="Diagram struktur sel tumbuhan">
      <rect x="65" y="22" width="170" height="106" rx="18" fill="#10b981" fill-opacity="0.12" stroke="#10b981" stroke-width="3"/>
      <rect x="75" y="32" width="150" height="86" rx="12" fill="none" stroke="#34d399" stroke-width="1.5" stroke-dasharray="4 3"/>
      <circle cx="120" cy="75" r="20" fill="#6366f1" fill-opacity="0.35" stroke="#818cf8" stroke-width="2"/>
      <ellipse cx="185" cy="58" rx="16" ry="9" fill="#059669" stroke="#34d399" stroke-width="1.5"/>
      <ellipse cx="185" cy="92" rx="14" ry="8" fill="#d97706" fill-opacity="0.4" stroke="#fbbf24" stroke-width="1.5"/>
      <text x="250" y="48" fill="#34d399" font-size="11" font-family="IBM Plex Mono, monospace">Dinding Sel</text>
      <text x="250" y="70" fill="#818cf8" font-size="11" font-family="IBM Plex Mono, monospace">Nukleus</text>
      <text x="250" y="92" fill="#6ee7b7" font-size="11" font-family="IBM Plex Mono, monospace">Kloroplas</text>
      <text x="250" y="114" fill="#fbbf24" font-size="11" font-family="IBM Plex Mono, monospace">Mitokondria</text>
    </svg>
  `,
  photosynthesis: `
    <svg viewBox="0 0 360 150" width="100%" height="150" role="img" aria-label="Diagram proses fotosintesis">
      <circle cx="65" cy="40" r="16" fill="#f59e0b" fill-opacity="0.35" stroke="#fbbf24" stroke-width="2"/>
      <text x="48" y="70" fill="#fbbf24" font-size="11" font-family="IBM Plex Mono, monospace">Cahaya</text>
      <ellipse cx="180" cy="75" rx="68" ry="34" fill="#10b981" fill-opacity="0.2" stroke="#34d399" stroke-width="2"/>
      <text x="150" y="79" fill="#6ee7b7" font-size="12" font-weight="700">Kloroplas</text>
      <text x="35" y="115" fill="#94a3b8" font-size="11" font-family="IBM Plex Mono, monospace">CO₂ + H₂O →</text>
      <text x="260" y="78" fill="#38bdf8" font-size="11" font-family="IBM Plex Mono, monospace">→ C₆H₁₂O₆ + O₂</text>
    </svg>
  `,
  heart: `
    <svg viewBox="0 0 360 150" width="100%" height="150" role="img" aria-label="Diagram empat ruang jantung">
      <rect x="115" y="25" width="130" height="100" rx="16" fill="#172238" stroke="#475569" stroke-width="2"/>
      <line x1="180" y1="25" x2="180" y2="125" stroke="#475569" stroke-width="2"/>
      <line x1="115" y1="72" x2="245" y2="72" stroke="#475569" stroke-width="2"/>
      <rect x="120" y="30" width="56" height="38" rx="6" fill="#0ea5e9" fill-opacity="0.22"/>
      <rect x="120" y="76" width="56" height="44" rx="6" fill="#0ea5e9" fill-opacity="0.32"/>
      <rect x="184" y="30" width="56" height="38" rx="6" fill="#f43f5e" fill-opacity="0.22"/>
      <rect x="184" y="76" width="56" height="44" rx="6" fill="#f43f5e" fill-opacity="0.35"/>
      <text x="22" y="54" fill="#38bdf8" font-size="11" font-family="IBM Plex Mono, monospace">Kanan (CO₂)</text>
      <text x="258" y="54" fill="#fb7185" font-size="11" font-family="IBM Plex Mono, monospace">Kiri (O₂)</text>
      <text x="258" y="102" fill="#fda4af" font-size="11" font-family="IBM Plex Mono, monospace">Aorta → Tubuh</text>
    </svg>
  `,
  solar: `
    <svg viewBox="0 0 360 150" width="100%" height="150" role="img" aria-label="Diagram orbit tata surya">
      <circle cx="95" cy="75" r="18" fill="#f59e0b"/>
      <ellipse cx="145" cy="75" rx="75" ry="30" fill="none" stroke="#334155" stroke-width="1.5"/>
      <ellipse cx="165" cy="75" rx="125" ry="48" fill="none" stroke="#334155" stroke-width="1.5"/>
      <circle cx="215" cy="65" r="6" fill="#38bdf8"/>
      <circle cx="285" cy="88" r="9" fill="#fbbf24"/>
      <ellipse cx="285" cy="88" rx="17" ry="5" fill="none" stroke="#fde68a" stroke-width="1.5"/>
      <text x="72" y="114" fill="#fbbf24" font-size="11" font-family="IBM Plex Mono, monospace">Matahari</text>
      <text x="200" y="52" fill="#38bdf8" font-size="11" font-family="IBM Plex Mono, monospace">Bumi</text>
      <text x="266" y="114" fill="#fde68a" font-size="11" font-family="IBM Plex Mono, monospace">Saturnus</text>
    </svg>
  `,
  eclipse: `
    <svg viewBox="0 0 360 150" width="100%" height="150" role="img" aria-label="Diagram gerhana matahari">
      <circle cx="60" cy="75" r="24" fill="#f59e0b"/>
      <polygon points="84,56 260,72 260,78 84,94" fill="#0f172a" fill-opacity="0.7" stroke="#475569" stroke-dasharray="3 3"/>
      <circle cx="170" cy="75" r="8" fill="#94a3b8"/>
      <circle cx="272" cy="75" r="16" fill="#0ea5e9"/>
      <text x="42" y="118" fill="#fbbf24" font-size="11" font-family="IBM Plex Mono, monospace">Matahari</text>
      <text x="155" y="118" fill="#cbd5e1" font-size="11" font-family="IBM Plex Mono, monospace">Bulan</text>
      <text x="256" y="118" fill="#38bdf8" font-size="11" font-family="IBM Plex Mono, monospace">Bumi (Umbra)</text>
    </svg>
  `,
  star: `
    <svg viewBox="0 0 360 150" width="100%" height="150" role="img" aria-label="Diagram evolusi bintang">
      <circle cx="65" cy="75" r="20" fill="#a855f7" fill-opacity="0.25" stroke="#c084fc" stroke-dasharray="4 3"/>
      <text x="46" y="114" fill="#c084fc" font-size="11" font-family="IBM Plex Mono, monospace">Nebula</text>
      <path d="M95 75 H130" stroke="#64748b" stroke-width="2"/>
      <circle cx="165" cy="75" r="18" fill="#f59e0b" fill-opacity="0.4" stroke="#fbbf24" stroke-width="2"/>
      <text x="140" y="114" fill="#fbbf24" font-size="11" font-family="IBM Plex Mono, monospace">Supernova</text>
      <path d="M195 75 H235" stroke="#64748b" stroke-width="2"/>
      <circle cx="275" cy="75" r="16" fill="#020617" stroke="#38bdf8" stroke-width="2.5"/>
      <text x="242" y="114" fill="#38bdf8" font-size="11" font-family="IBM Plex Mono, monospace">Black Hole</text>
    </svg>
  `,
};

export function renderIllustration(type) {
  return DIAGRAMS[type] || DIAGRAMS.atom;
}
