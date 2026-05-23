import React from 'react'

const colors = ['bg-indigo-600','bg-rose-500','bg-emerald-500','bg-sky-500','bg-violet-600','bg-yellow-600']

export default function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const parts = name.split(' ').filter(Boolean)
  const initials = parts.length === 1 ? parts[0][0] : (parts[0][0] + parts[1][0])
  const color = colors[Math.abs(name.split('').reduce((s,c)=>s+c.charCodeAt(0),0)) % colors.length]
  return (
    <div
      title={name}
      className={`flex items-center justify-center ${color} text-white rounded-full font-medium`} 
      style={{ width: size, height: size, minWidth: size }}
    >
      <span style={{ fontSize: Math.floor(size / 2.2) }}>{initials.toUpperCase()}</span>
    </div>
  )
}
