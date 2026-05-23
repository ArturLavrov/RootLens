import React from 'react'

type Props = {
  label: string
  percent: number
  color?: string
}

export default function ProgressBar({ label, percent, color = 'linear-gradient(90deg,#7c3aed,#06b6d4)' }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-slate-300">
        <span>{label}</span>
        <span className="font-semibold">{percent}%</span>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full"
          style={{ width: `${Math.max(0, Math.min(100, percent))}%`, background: color }}
        />
      </div>
    </div>
  )
}
