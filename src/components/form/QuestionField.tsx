import type { FormQuestion } from '../../types/form'

/** Wizard-side answer value for a single question. */
export interface AnswerValue {
  ids: number[] | null
  text: string | null
}

interface QuestionFieldProps {
  question: FormQuestion
  value: AnswerValue | undefined
  onChange: (value: AnswerValue) => void
}

const labelClass = 'text-sm font-medium text-brand'
const inputClass =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-navy outline-none transition-colors placeholder:text-slate-400 focus:border-brand focus:bg-white'

export default function QuestionField({ question, value, onChange }: QuestionFieldProps) {
  const options = question.options ?? []

  if (question.type === 'text' || options.length === 0) {
    return (
      <label className="flex flex-col gap-2">
        <span className={labelClass}>{question.name}</span>
        <input
          type="text"
          value={value?.text ?? ''}
          onChange={(e) => onChange({ ids: null, text: e.target.value })}
          className={inputClass}
        />
      </label>
    )
  }

  if (question.type === 'multi-select') {
    const selected = value?.ids ?? []
    const toggle = (id: number) => {
      const next = selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id]
      onChange({ ids: next, text: null })
    }
    return (
      <fieldset className="flex flex-col gap-2">
        <legend className={labelClass}>{question.name}</legend>
        <div className="flex flex-wrap gap-2 pt-1">
          {options.map((opt) => {
            const active = selected.includes(opt.id)
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggle(opt.id)}
                aria-pressed={active}
                className={[
                  'rounded-full border px-4 py-2 text-sm transition-colors',
                  active
                    ? 'border-brand bg-brand text-white'
                    : 'border-slate-200 bg-slate-50 text-navy hover:border-brand',
                ].join(' ')}
              >
                {opt.value}
              </button>
            )
          })}
        </div>
      </fieldset>
    )
  }

  // Single select — styled native dropdown.
  const selectedId = value?.ids?.[0] ?? ''
  return (
    <label className="flex flex-col gap-2">
      <span className={labelClass}>{question.name}</span>
      <div className="relative">
        <select
          value={selectedId}
          onChange={(e) =>
            onChange({
              ids: e.target.value ? [Number(e.target.value)] : null,
              text: null,
            })
          }
          className={`${inputClass} appearance-none pr-10 ${selectedId ? '' : 'text-slate-400'}`}
        >
          <option value="">Select an option</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id} className="text-navy">
              {opt.value}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 16 16"
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          fill="none"
          aria-hidden="true"
        >
          <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </label>
  )
}
