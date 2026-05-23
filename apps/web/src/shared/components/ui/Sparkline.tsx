import React from 'react'

export default function Sparkline({ data, stroke = '#60a5fa', width = 120, height = 34 }: { data: number[]; stroke?: string; width?: number; height?: number }) {
  const padding = 2
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = Math.max(1, max - min)
  const innerW = width - padding * 2
  const innerH = height - padding * 2

  const pts = data.map((d, i) => {
    const x = padding + (i * innerW) / Math.max(1, data.length - 1)
    const y = padding + (1 - (d - min) / range) * innerH
    return [x, y]
  })
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')

  return (
    <svg width={width} height={height} className="block">
      <path d={path} fill="none" stroke={stroke} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
