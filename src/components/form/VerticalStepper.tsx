import type { StepNo } from './useLeadForm'

interface VerticalStepperProps {
  current: StepNo
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

/**
 * Step indicator on the popup's brand panel. Vertical with every label on
 * desktop; on mobile the panel sits above the form, so it collapses to a single
 * row of markers where only the current step keeps its label.
 */
export default function VerticalStepper({ current }: VerticalStepperProps) {
  return (
    <ol className="flex items-center gap-3 md:flex-col md:items-start md:gap-5">
      {STEPS.map((step) => {
        const done = step.n < current
        const active = step.n === current
        return (
          <li key={step.n} className="flex min-w-0 items-center gap-2 md:gap-3">
            <span
              className={[
                'flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold md:size-8',
                done
                  ? 'bg-navy text-white'
                  : active
                    ? 'bg-white text-navy'
                    : 'bg-white/20 text-white',
              ].join(' ')}
            >
              {done ? <CheckIcon /> : step.n}
            </span>
            <span
              className={[
                'truncate text-sm md:text-base',
                active ? 'font-medium text-white' : 'hidden text-white/70 md:inline',
              ].join(' ')}
            >
              {step.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
