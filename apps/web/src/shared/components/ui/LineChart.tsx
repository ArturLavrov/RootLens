import React, { useId, useRef, useEffect, useState } from 'react'

type Props = {
  data: number[]
  labels?: string[]
  width?: number
  height?: number
  stroke?: string
  fill?: string
}

export default function LineChart({ data, labels = [], width = 520, height = 160, stroke = '#60a5fa', fill = 'rgba(96,165,250,0.12)' }: Props) {
  const id = useId().replace(/[:]/g, '')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState({ w: width, h: height })

  // maintain aspect ratio based on default width/height
  const aspect = height / width

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width
        const h = Math.max(120, Math.round(w * aspect))
        setSize({ w: Math.round(w), h })
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [aspect])

  const leftPad = 40
  const rightPad = 12
  const topPad = 12
  const bottomPad = 28

  const svgW = Math.max(200, size.w)
  const svgH = Math.max(120, size.h)

  const innerW = svgW - leftPad - rightPad
  const innerH = svgH - topPad - bottomPad

  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = Math.max(1, max - min)

  const pts = data.map((d, i) => {
    const x = leftPad + (i * innerW) / Math.max(1, data.length - 1)
    const y = topPad + (1 - (d - min) / range) * innerH
    return [x, y]
  })

  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
  const areaPath = `${path} L ${leftPad + innerW} ${topPad + innerH} L ${leftPad} ${topPad + innerH} Z`

  // Y ticks (4 ticks)
  const ticks = [0, 0.33, 0.66, 1].map((t) => Math.round(min + t * range))

  return (
    <div ref={containerRef} className="w-full">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" height={svgH} className="block">
        <defs>
          <linearGradient id={`grad-${id}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* background */}
        <rect x={0} y={0} width={svgW} height={svgH} rx={6} fill="transparent" />

        {/* grid + y axis labels */}
        {ticks.map((tick, i) => {
          const y = topPad + (1 - (tick - min) / range) * innerH
          return (
            <g key={i}>
              <line x1={leftPad} x2={leftPad + innerW} y1={y} y2={y} stroke="#0f1724" strokeWidth={1} />
              <text x={8} y={y + 4} fontSize={12} fill="#94a3b8">{tick}</text>
            </g>
          )
        })}

        {/* area + line */}
        <path d={areaPath} fill={`url(#grad-${id})`} stroke="none" />
        <path d={path} fill="none" stroke={stroke} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {/* points */}
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={2.5} fill={stroke} />
        ))}

        {/* x axis */}
        <line x1={leftPad} x2={leftPad + innerW} y1={topPad + innerH} y2={topPad + innerH} stroke="#0f1724" />

        {/* x labels - show up to 6 labels */}
        {labels && labels.length > 0 && (() => {
          const maxLabels = 6
          const step = Math.max(1, Math.ceil(labels.length / maxLabels))
          return labels.map((lab, i) => {
            if (i % step !== 0) return null
            const x = leftPad + (i * innerW) / Math.max(1, labels.length - 1)
            const y = topPad + innerH + 16
            return (
              <text key={i} x={x} y={y} fontSize={11} fill="#94a3b8" textAnchor="middle">{lab}</text>
            )
          })
        })()}
      </svg>
    </div>
  )
}
