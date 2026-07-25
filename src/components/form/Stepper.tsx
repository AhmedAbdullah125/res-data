interface StepperProps {
  current: 1 | 2 | 3
}

const STEPS = [
  { n: 1, label: 'Your details' },
  { n: 2, label: 'Pick a time' },
  { n: 3, label: 'Tell us more' },
] as const

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
      <path d="m4 8 2.5 2.5L12 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Stepper({ current }: StepperProps) {
  return (
    <ol className="flex items-start">
      {STEPS.map((step, i) => {
        const done = step.n < current
        const active = step.n === current
        const filled = done || active
        return (
          <li
            key={step.n}
            className={i < STEPS.length - 1 ? 'flex flex-1 flex-col' : 'flex flex-col'}
          >
            <div className="flex items-center">
              <span
                className={[
                  'flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                  filled
                    ? 'border-navy bg-navy text-white'
                    : 'border-slate-300 bg-white text-slate-400',
                ].join(' ')}
              >
                {done ? <CheckIcon /> : String(step.n).padStart(2, '0')}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  className={`mx-2 h-0.5 flex-1 rounded transition-colors ${
                    done ? 'bg-navy' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
            <span
              className={`mt-2 text-xs sm:text-sm ${active ? 'font-medium text-navy' : 'text-slate-500'}`}
            >
              {step.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
