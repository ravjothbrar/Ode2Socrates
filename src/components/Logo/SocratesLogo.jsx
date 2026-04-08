import React from 'react'

// Dense flowing hair paths — 22 lines from crown sweeping back and down
// mimicking the dense parallel line-art of the reference image
const HAIR = [
  // Right side (closest to face) → left side, each offset ~3-4px
  "M 148 22 C 146 34 142 50 136 65 C 130 79 122 91 114 103 C 108 113 102 122 98 132",
  "M 144 20 C 142 32 138 48 132 63 C 126 77 118 89 110 101 C 104 111 98 120 94 130",
  "M 140 18 C 138 30 134 46 128 61 C 122 75 114 87 106 99 C 100 109 95 118 91 128",
  "M 136 17 C 133 29 129 45 124 60 C 118 74 110 86 102 98 C 96 108 91 117 88 127",
  "M 132 16 C 129 28 125 44 120 59 C 114 73 106 85 98 97 C 92 107 88 116 86 126",
  "M 128 15 C 125 27 121 43 116 58 C 110 72 102 84 94 96 C 88 106 84 115 83 125",
  "M 124 15 C 121 27 117 42 112 57 C 106 71 98 83 90 95 C 84 105 81 114 80 124",
  "M 120 14 C 117 26 113 41 108 56 C 102 70 94 82 86 94 C 81 104 78 113 77 123",
  "M 116 14 C 113 26 109 40 104 55 C 98 69 90 81 82 93 C 77 103 75 112 74 122",
  "M 112 14 C 109 26 105 40 100 54 C 94 68 86 80 78 92 C 73 102 71 111 71 121",
  "M 108 14 C 105 26 101 39 96 53 C 90 67 83 79 75 91 C 70 101 68 110 69 120",
  "M 104 14 C 101 26 97 38 92 52 C 86 66 79 78 72 90 C 67 100 66 109 67 119",
  // Wavy variant lines for texture
  "M 138 19 C 135 31 130 47 125 62 C 119 76 111 88 103 100 C 97 110 93 119 90 129",
  "M 130 15 C 127 27 123 43 118 58 C 112 72 104 84 96 96 C 90 106 86 115 84 125",
  "M 122 15 C 119 27 115 42 110 57 C 104 71 96 83 88 95 C 83 105 80 114 78 124",
  "M 114 14 C 111 26 107 41 102 55 C 96 69 88 81 80 93 C 75 103 73 112 72 122",
]

// Beard lines — merge from chin/face downward, continuing the hair flow
const BEARD = [
  "M 154 90 C 150 102 144 114 137 124 C 130 133 122 140 115 147 C 109 153 104 158 101 164",
  "M 150 88 C 146 100 140 112 133 122 C 126 131 118 138 111 145 C 105 151 100 156 97 162",
  "M 146 86 C 142 98 136 110 129 120 C 122 129 114 136 107 143 C 101 149 96 154 93 160",
  "M 142 85 C 138 97 132 109 125 119 C 118 128 110 135 103 142 C 97 148 92 153 90 159",
  "M 138 84 C 134 96 128 108 121 118 C 114 127 106 134 99 141 C 93 147 89 152 87 158",
  "M 134 83 C 130 95 124 107 117 117 C 110 126 102 133 95 140 C 89 146 86 151 84 157",
  "M 130 83 C 126 95 120 107 113 117 C 106 126 98 133 91 140 C 85 146 82 151 81 157",
  "M 126 84 C 122 96 116 108 109 118 C 102 127 94 134 87 141 C 82 147 80 152 79 158",
]

function SocratesSVG({ width = 150, color = '#a78bfa' }) {
  const W = width
  const H = Math.round(width * 1.35)
  const sw = 1.5   // main outline strokes
  const sh = 0.95  // hair strokes
  const sr = 1.8   // robe strokes

  return (
    <svg
      width={W}
      height={H}
      viewBox="0 0 200 270"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <filter id="socGlow2" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="b1"/>
          <feGaussianBlur stdDeviation="10" result="b2"/>
          <feMerge>
            <feMergeNode in="b2"/>
            <feMergeNode in="b1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <g stroke={color} strokeLinecap="round" strokeLinejoin="round" fill="none">

        {/* ══ ROBE — large flowing mass, lower portion ══ */}
        {/* Left outer robe edge */}
        <path strokeWidth={sr}
          d="M 22 270 C 24 242 28 215 34 192 C 39 172 46 155 55 142
             C 62 131 70 124 80 120 C 88 116 97 114 106 113"
        />
        {/* Right robe edge */}
        <path strokeWidth={sr}
          d="M 168 270 C 166 242 163 215 160 192 C 156 172 152 155 150 142
             C 148 132 147 124 148 116"
        />
        {/* Shoulder/collar transition */}
        <path strokeWidth={sw}
          d="M 106 113 C 118 110 130 110 140 113 C 144 115 148 116 150 118"
        />
        {/* Robe fold 1 */}
        <path strokeWidth={sw * 0.75}
          d="M 55 138 C 52 162 50 188 50 214 C 50 234 52 250 54 270"
        />
        {/* Robe fold 2 */}
        <path strokeWidth={sw * 0.75}
          d="M 72 124 C 70 150 68 178 69 205 C 70 225 72 248 74 270"
        />
        {/* Robe fold 3 */}
        <path strokeWidth={sw * 0.75}
          d="M 90 116 C 88 144 87 172 88 200 C 89 220 92 244 95 270"
        />
        {/* Robe fold 4 */}
        <path strokeWidth={sw * 0.75}
          d="M 110 113 C 109 140 109 168 110 196 C 111 218 113 242 116 270"
        />
        {/* Robe fold 5 */}
        <path strokeWidth={sw * 0.75}
          d="M 130 112 C 130 138 130 166 131 194 C 132 216 134 240 136 270"
        />
        {/* Right drape/chest */}
        <path strokeWidth={sw * 0.8}
          d="M 148 120 C 152 138 155 158 155 180 C 155 200 153 222 152 244 C 151 254 150 262 150 270"
        />
        {/* Collar/neck drape */}
        <path strokeWidth={sw * 0.7}
          d="M 128 112 C 132 118 136 126 136 134 C 136 140 133 145 130 148"
        />

        {/* ══ NECK ══ */}
        <path strokeWidth={sw}
          d="M 128 104 C 132 108 136 114 134 122 C 133 127 130 130 127 130"
        />
        <path strokeWidth={sw}
          d="M 138 102 C 142 107 144 114 142 121 C 141 126 138 129 135 130"
        />

        {/* ══ HEAD OUTLINE — profile, head slightly bowed ══ */}
        {/* Back of skull → crown → over head to brow */}
        <path strokeWidth={sw}
          d="M 90 95 C 84 80 82 62 84 48 C 86 34 92 22 104 16
             C 116 10 130 12 140 18 C 150 24 157 34 160 46
             C 163 56 163 68 159 78 C 156 86 151 92 145 97"
        />
        {/* Chin–beard junction line */}
        <path strokeWidth={sw}
          d="M 145 97 C 142 103 138 108 133 112 C 130 114 127 115 124 115"
        />

        {/* ══ FACE FEATURES — partial right-profile ══ */}
        {/* Brow ridge — heavy and prominent */}
        <path strokeWidth={sw}
          d="M 150 40 C 154 37 159 37 162 41 C 163 43 163 46 161 48"
        />
        {/* Eye socket / upper lid */}
        <path strokeWidth={sw * 0.85}
          d="M 153 47 C 156 44 161 44 163 47 C 164 49 163 52 160 53
             C 157 54 153 53 152 50 C 151 48 152 47 153 47"
        />
        {/* Pupil */}
        <ellipse cx="157" cy="49" rx="2.5" ry="2.8" strokeWidth={sw * 0.7}/>
        {/* Strong profile nose */}
        <path strokeWidth={sw}
          d="M 161 56 C 165 63 167 72 164 79 C 162 84 158 87 155 88"
        />
        {/* Nostril */}
        <path strokeWidth={sw * 0.75}
          d="M 164 79 C 162 83 159 86 161 89 C 162 91 165 91 166 88"
        />
        {/* Cheekbone/jaw definition */}
        <path strokeWidth={sw * 0.75}
          d="M 160 54 C 164 60 166 70 164 80"
        />

        {/* ══ HAIR TEXTURE — 16 thin flowing parallel lines ══ */}
        {HAIR.map((d, i) => (
          <path key={`h${i}`} d={d} strokeWidth={sh} opacity={0.9}/>
        ))}

        {/* ══ BEARD — 8 lines flowing from chin down ══ */}
        {BEARD.map((d, i) => (
          <path key={`b${i}`} d={d} strokeWidth={sh} opacity={0.9}/>
        ))}

        {/* ══ HAND — barely visible, contemplating near beard ══ */}
        {/* Back of hand */}
        <path strokeWidth={sw * 0.85}
          d="M 136 102 C 133 108 131 115 132 121 C 133 126 136 128 139 126
             C 142 124 143 119 142 114 C 141 109 139 104 136 102"
        />
        {/* Index finger */}
        <path strokeWidth={sw * 0.75}
          d="M 133 102 C 132 96 131 90 133 86 C 134 83 137 83 138 86
             C 139 90 138 96 137 102"
        />
        {/* Middle finger */}
        <path strokeWidth={sw * 0.75}
          d="M 137 101 C 136 95 136 89 138 85 C 139 82 142 82 143 85
             C 144 89 143 95 142 101"
        />
        {/* Thumb */}
        <path strokeWidth={sw * 0.7}
          d="M 136 106 C 132 104 130 100 131 96 C 132 93 135 92 137 94"
        />

      </g>
    </svg>
  )
}

export default function SocratesLogo({ size = 'canvas', showTitle = false, typing = false }) {
  if (size === 'canvas') {
    return (
      <div
        className={typing ? 'socrates-typing' : ''}
        style={{
          position: 'relative',
          userSelect: 'none',
          pointerEvents: 'none',
          filter: typing
            ? undefined
            : 'drop-shadow(0 0 8px #7c3aed55) drop-shadow(0 0 18px #7c3aed22)',
          transition: 'filter 0.3s ease',
          transformOrigin: 'top left',
        }}
      >
        <SocratesSVG width={140} color="#a78bfa" />
        {showTitle && (
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px', fontWeight: 600,
            letterSpacing: '0.2em', color: '#a78bfa',
            textShadow: '0 0 12px #7c3aed66',
            textTransform: 'uppercase', textAlign: 'center',
            marginTop: 4, opacity: 0.7,
          }}>
            Ode2Socrates
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <SocratesSVG
        width={size === 'sm' ? 65 : 95}
        color="#a78bfa"
      />
      {showTitle && (
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '17px', fontWeight: 600,
          letterSpacing: '0.15em', color: '#a78bfa',
          textShadow: '0 0 16px #7c3aed66',
          textTransform: 'uppercase',
        }}>
          Ode2Socrates
        </div>
      )}
    </div>
  )
}
