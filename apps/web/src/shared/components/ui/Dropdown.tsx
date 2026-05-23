import React, { useEffect, useRef, useState } from 'react'

type Option = { label: string; value: string | number }

type Props = {
  options: Option[]
  value?: string | number
  onChange: (v: string | number) => void
  buttonClassName?: string
  menuClassName?: string
}

export default function Dropdown({ options, value, onChange, buttonClassName = '', menuClassName = '' }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const selected = options.find((o) => String(o.value) === String(value)) ?? options[0]

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={`flex items-center justify-between gap-2 ${buttonClassName} bg-transparent`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="text-sm">{selected?.label}</span>
        <svg className="w-3 h-3 text-slate-300" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className={`absolute right-0 mt-2 bg-[#0b1220] border border-slate-800 rounded ${menuClassName} z-50`} role="menu">
          {options.map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800/40 text-slate-200 text-sm"
              role="menuitem"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
