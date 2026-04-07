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
      background: hovered ? 'rgba(167,139,250,0.12)' : 'rgba(124,58,237,0.08)',
      borderColor: hovered ? '#7c3aed' : '#2a2a4a',
      color: hovered ? '#e9d5ff' : '#a78bfa',
      boxShadow: hovered ? '0 0 0 1px #7c3aed44, 0 2px 8px #7c3aed22' : 'none',
    },
    primary: {
      background: hovered
        ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
        : 'linear-gradient(135deg, #6d28d9, #5b21b6)',
      borderColor: hovered ? '#a78bfa' : '#7c3aed',
      color: '#f5f3ff',
      boxShadow: hovered ? '0 0 16px #7c3aed44' : '0 0 8px #7c3aed22',
    },
    ghost: {
      background: hovered ? 'rgba(167,139,250,0.08)' : 'transparent',
      borderColor: 'transparent',
      color: hovered ? '#c4b5fd' : '#94a3b8',
      boxShadow: 'none',
    },
    danger: {
      background: hovered ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.06)',
      borderColor: hovered ? '#ef4444' : '#7f1d1d',
      color: hovered ? '#fca5a5' : '#f87171',
      boxShadow: 'none',
    },
    active: {
      background: 'rgba(167,139,250,0.2)',
      borderColor: '#7c3aed',
      color: '#e9d5ff',
      boxShadow: '0 0 0 1px #7c3aed66',
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
