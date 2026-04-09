import React, { useState } from 'react'

export default function Button({
  children,
  icon,
  onClick,
  variant = 'default',   // 'default' | 'ghost' | 'danger' | 'primary'
  size = 'md',           // 'sm' | 'md' | 'lg'
  active = false,
  disabled = false,
  title,
  style: extraStyle = {},
  className = '',
}) {
  const [hovered, setHovered] = useState(false)

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: '1px solid',
    borderRadius: '8px',
    transition: 'all 0.15s ease',
    userSelect: 'none',
    outline: 'none',
    opacity: disabled ? 0.5 : 1,
    position: 'relative',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  }

  const sizes = {
    sm: { fontSize: '11px', padding: '4px 10px', height: '28px' },
    md: { fontSize: '13px', padding: '6px 14px', height: '34px' },
    lg: { fontSize: '14px', padding: '8px 18px', height: '40px' },
  }

  const variants = {
    default: {
      background: hovered ? 'var(--accent-a12)' : 'var(--accent-a08)',
      borderColor: hovered ? 'var(--purple-mid)' : 'var(--border)',
      color: hovered ? 'var(--lavender)' : 'var(--purple-bright)',
      boxShadow: hovered ? '0 0 0 1px var(--border-glow), 0 2px 8px var(--border-glow)' : 'none',
    },
    primary: {
      background: hovered
        ? 'linear-gradient(135deg, var(--purple-mid), var(--purple-dim))'
        : 'linear-gradient(135deg, var(--purple-dim), var(--purple-mid))',
      borderColor: hovered ? 'var(--purple-bright)' : 'var(--purple-mid)',
      color: 'rgba(255,255,255,0.93)',
      boxShadow: hovered ? '0 0 16px var(--border-glow)' : '0 0 8px var(--border-glow)',
    },
    ghost: {
      background: hovered ? 'var(--accent-a08)' : 'transparent',
      borderColor: 'transparent',
      color: hovered ? 'var(--purple-pale)' : '#94a3b8',
      boxShadow: 'none',
    },
    danger: {
      background: hovered ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.06)',
      borderColor: hovered ? '#ef4444' : '#7f1d1d',
      color: hovered ? '#fca5a5' : '#f87171',
      boxShadow: 'none',
    },
    active: {
      background: 'var(--accent-a20)',
      borderColor: 'var(--purple-mid)',
      color: 'var(--lavender)',
      boxShadow: '0 0 0 1px var(--border-glow)',
    },
  }

  const variantStyle = active ? variants.active : variants[variant] || variants.default

  return (
    <button
      onClick={disabled ? undefined : onClick}
      title={title}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...base, ...sizes[size], ...variantStyle, ...extraStyle }}
    >
      {icon && (
        <span style={{ display: 'flex', alignItems: 'center', fontSize: size === 'sm' ? '12px' : '14px' }}>
          {icon}
        </span>
      )}
      {children}
    </button>
  )
}
