import React from 'react'

/**
 * Detailed artistic line-art SVG of Socrates in 3/4 profile —
 * classical philosopher bust, facing left, contemplative pose.
 * Flowing hair, long beard, robes, hand at chin.
 * Purple strokes on transparent background.
 */
function SocratesSVG({ width = 150, color = '#a78bfa', glow = false }) {
  const sw = 1.6
  const swThin = 1.1
  const swHair = 1.0
  const glowFilter = glow ? 'url(#socGlow)' : undefined

  return (
    <svg
      width={width}
      height={Math.round(width * 1.4)}
      viewBox="0 0 180 252"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <filter id="socGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur1"/>
          <feGaussianBlur stdDeviation="7" result="blur2"/>
          <feMerge>
            <feMergeNode in="blur2"/>
            <feMergeNode in="blur1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <g filter={glowFilter} stroke={color} strokeLinecap="round" strokeLinejoin="round">

        {/* ══════════════════════════════════════════
            HEAD — high bald forehead, 3/4 profile facing left
            ══════════════════════════════════════════ */}
        {/* Main skull outline */}
        <path strokeWidth={sw}
          d="M 108 14 C 118 10 136 10 150 18 C 162 26 168 42 166 58
             C 164 72 158 82 150 90 C 144 96 138 100 132 105
             C 128 108 124 111 120 116 C 116 120 114 126 112 132"
        />
        {/* Forehead to chin — face profile */}
        <path strokeWidth={sw}
          d="M 108 14 C 102 20 98 30 98 42 C 98 50 100 57 98 65
             C 96 72 92 78 90 86 C 88 92 90 98 88 106
             C 87 112 86 118 88 124 C 90 130 94 134 92 140"
        />
        {/* Strong brow ridge */}
        <path strokeWidth={sw}
          d="M 98 50 C 102 46 110 44 118 46 C 124 48 128 52 130 56"
        />
        {/* Eye socket depression */}
        <path strokeWidth={swThin}
          d="M 100 54 C 103 52 108 51 113 53 C 117 55 119 59 117 62
             C 115 65 110 66 106 64 C 102 62 100 58 100 54 Z"
        />
        {/* Pupil */}
        <ellipse cx="109" cy="58" rx="3" ry="3.5" strokeWidth={swThin} />
        {/* Nose — strong profile */}
        <path strokeWidth={sw}
          d="M 98 66 C 94 72 90 80 88 88 C 87 92 88 96 92 100
             C 95 103 98 104 96 108"
        />
        {/* Nostril wing */}
        <path strokeWidth={swThin}
          d="M 92 100 C 90 103 88 106 90 109 C 92 111 96 110 98 108"
        />
        {/* Upper lip / philtrum */}
        <path strokeWidth={swThin}
          d="M 96 108 C 94 113 92 118 90 122"
        />

        {/* ══════════════════════════════════════════
            HAIR — long flowing wavy, sweeping back from crown
            ══════════════════════════════════════════ */}
        {/* Main hair mass boundary — from crown, sweeping back and cascading down */}
        <path strokeWidth={sw}
          d="M 108 14 C 118 10 136 10 150 18 C 162 26 168 38 166 52
             C 164 58 162 64 158 70 C 155 76 148 82 140 88
             C 130 95 118 102 108 112 C 98 120 88 132 80 148
             C 72 162 68 178 65 194 C 62 208 60 222 58 236"
        />
        {/* Hair flow line 1 — from crown going back */}
        <path strokeWidth={swHair}
          d="M 112 16 C 124 12 142 12 154 22 C 162 30 166 46 162 60
             C 158 72 150 82 140 90 C 130 98 116 108 104 120
             C 94 130 84 144 76 160 C 70 172 66 186 63 200"
        />
        {/* Hair flow line 2 */}
        <path strokeWidth={swHair}
          d="M 118 16 C 132 14 148 16 158 26 C 165 34 167 50 162 64
             C 158 76 150 86 140 94 C 128 102 114 112 100 126
             C 90 136 80 150 72 166 C 66 178 62 192 60 206"
        />
        {/* Hair flow line 3 */}
        <path strokeWidth={swHair}
          d="M 126 18 C 138 16 152 20 160 30 C 166 38 166 54 160 68
             C 155 80 144 90 132 98 C 120 106 106 116 94 130
             C 84 142 74 156 68 172 C 62 184 60 198 58 212"
        />
        {/* Hair flow line 4 — slightly wavy */}
        <path strokeWidth={swHair}
          d="M 134 20 C 146 20 158 26 163 38 C 167 48 165 62 158 74
             C 152 84 142 92 130 100 C 116 110 102 120 90 134
             C 78 146 70 162 64 178 C 59 190 57 204 56 218"
        />
        {/* Hair flow line 5 */}
        <path strokeWidth={swHair}
          d="M 142 24 C 152 26 161 34 164 46 C 166 56 163 68 156 78
             C 148 88 136 96 124 104 C 110 114 96 124 84 138
             C 74 150 66 164 61 180 C 57 192 55 206 54 220"
        />
        {/* Hair wave detail near crown */}
        <path strokeWidth={swHair}
          d="M 150 18 C 157 26 162 38 160 52 C 157 64 150 74 142 82
             C 132 92 120 100 108 110 C 96 120 86 132 77 146"
        />
        {/* Loose strand falling forward */}
        <path strokeWidth={swHair}
          d="M 104 18 C 100 26 97 36 97 48 C 97 58 100 66 98 76"
        />
        {/* Temple/side hair detail */}
        <path strokeWidth={swHair}
          d="M 100 28 C 96 36 94 46 95 56 C 96 64 98 70 96 78"
        />

        {/* ══════════════════════════════════════════
            BEARD — long flowing from chin/jaw downward
            ══════════════════════════════════════════ */}
        {/* Beard outer boundary */}
        <path strokeWidth={sw}
          d="M 92 140 C 88 148 85 158 84 168 C 82 178 82 188 84 198
             C 86 208 90 216 92 224 C 94 230 93 236 90 240"
        />
        {/* Beard right boundary */}
        <path strokeWidth={sw}
          d="M 112 132 C 116 142 118 154 116 166 C 114 178 108 188 106 198
             C 104 208 104 218 102 228 C 100 234 96 238 92 240"
        />
        {/* Mustache arching over beard */}
        <path strokeWidth={swThin}
          d="M 96 120 C 98 116 103 114 108 116 C 112 118 114 122 112 126
             C 110 130 106 131 102 130 C 98 128 96 124 96 120"
        />
        {/* Beard flow line 1 */}
        <path strokeWidth={swHair}
          d="M 96 128 C 94 138 92 150 92 162 C 92 174 94 184 95 194
             C 96 202 95 210 92 218"
        />
        {/* Beard flow line 2 */}
        <path strokeWidth={swHair}
          d="M 100 130 C 99 142 98 154 98 166 C 98 178 100 188 100 198
             C 100 208 98 216 96 224"
        />
        {/* Beard flow line 3 */}
        <path strokeWidth={swHair}
          d="M 104 132 C 104 144 104 156 103 168 C 102 180 102 190 103 200
             C 104 210 103 218 101 226"
        />
        {/* Beard flow line 4 */}
        <path strokeWidth={swHair}
          d="M 108 134 C 109 146 110 158 108 170 C 106 182 105 192 106 202
             C 107 212 106 220 104 228"
        />
        {/* Beard curl/wave details */}
        <path strokeWidth={swHair}
          d="M 88 152 C 85 160 84 170 86 180 C 87 188 90 196 90 204"
        />
        <path strokeWidth={swHair}
          d="M 112 148 C 114 158 114 170 112 180 C 110 190 109 200 110 210"
        />
        {/* Beard texture — short cross waves */}
        <path strokeWidth={swHair * 0.8}
          d="M 90 162 C 93 158 97 157 101 160 C 105 163 108 166 112 164"
        />
        <path strokeWidth={swHair * 0.8}
          d="M 89 178 C 93 174 98 173 103 176 C 107 179 110 182 113 180"
        />
        <path strokeWidth={swHair * 0.8}
          d="M 90 194 C 94 190 99 189 104 192 C 108 195 110 198 112 196"
        />

        {/* ══════════════════════════════════════════
            HAND — left hand raised contemplatively to chin/beard
            ══════════════════════════════════════════ */}
        {/* Back of hand / wrist */}
        <path strokeWidth={sw}
          d="M 72 148 C 76 144 82 142 88 142 C 92 142 95 144 96 148
             C 97 152 94 156 90 158 C 86 160 80 160 76 157
             C 72 154 70 150 72 148"
        />
        {/* Index finger */}
        <path strokeWidth={swThin}
          d="M 88 142 C 86 136 84 130 84 124 C 84 120 86 118 88 120
             C 90 122 90 128 90 134 C 90 138 90 142 88 142"
        />
        {/* Middle finger */}
        <path strokeWidth={swThin}
          d="M 92 142 C 91 136 90 130 91 124 C 91 120 93 118 95 120
             C 97 122 96 128 95 134 C 94 138 93 142 92 142"
        />
        {/* Ring finger — slightly shorter */}
        <path strokeWidth={swThin}
          d="M 96 142 C 96 136 96 130 97 126 C 98 122 100 120 101 122
             C 102 124 101 130 100 136 C 99 140 98 142 96 142"
        />
        {/* Thumb visible side */}
        <path strokeWidth={swThin}
          d="M 76 152 C 73 148 72 144 74 140 C 76 136 80 135 82 137
             C 84 140 83 145 82 149"
        />
        {/* Wrist / lower arm */}
        <path strokeWidth={sw}
          d="M 72 148 C 68 154 65 162 64 170 C 63 176 64 182 66 186"
        />

        {/* ══════════════════════════════════════════
            ROBE / TOGA — draped over shoulder and chest
            ══════════════════════════════════════════ */}
        {/* Main robe outline — left shoulder, falling down */}
        <path strokeWidth={sw}
          d="M 50 180 C 48 168 50 156 56 148 C 60 142 66 138 72 136
             C 78 134 84 134 88 136"
        />
        {/* Robe falling from left shoulder down */}
        <path strokeWidth={sw}
          d="M 50 180 C 44 194 40 210 38 226 C 36 238 36 248 38 252"
        />
        {/* Robe right edge */}
        <path strokeWidth={sw}
          d="M 88 136 C 92 140 94 148 93 158 C 92 168 88 178 86 190
             C 84 202 84 214 86 226 C 87 234 88 242 88 252"
        />
        {/* Robe fabric fold 1 */}
        <path strokeWidth={swThin}
          d="M 56 162 C 60 170 62 180 62 192 C 62 202 60 212 60 222"
        />
        {/* Robe fabric fold 2 */}
        <path strokeWidth={swThin}
          d="M 64 158 C 68 168 70 180 70 192 C 70 204 68 214 68 226"
        />
        {/* Robe fabric fold 3 */}
        <path strokeWidth={swThin}
          d="M 74 154 C 78 164 79 176 78 190 C 77 202 75 212 75 224"
        />
        {/* Shoulder seam/collar */}
        <path strokeWidth={swThin}
          d="M 56 148 C 62 144 70 142 78 142 C 84 142 88 144 90 148"
        />
        {/* Drape over forearm */}
        <path strokeWidth={swThin}
          d="M 64 170 C 60 174 56 180 54 188 C 52 196 53 204 55 210"
        />

        {/* ══════════════════════════════════════════
            NECK
            ══════════════════════════════════════════ */}
        <path strokeWidth={sw}
          d="M 112 132 C 116 136 118 142 116 148 C 114 154 110 158 106 160
             C 100 163 94 163 90 160"
        />
        <path strokeWidth={sw}
          d="M 92 140 C 90 146 90 152 92 158 C 93 162 95 164 90 166"
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
            : 'drop-shadow(0 0 6px #7c3aed55) drop-shadow(0 0 14px #7c3aed22)',
          transition: 'filter 0.3s ease',
          transformOrigin: 'top left',
        }}
      >
        <SocratesSVG width={130} color="#a78bfa" />
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

  // Tour/modal variant
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
