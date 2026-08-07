'use client'

import type { LeadForm } from '@/components/form/useLeadForm'
import StepDetails from '@/components/form/StepDetails'
import StepSchedule from '@/components/form/StepSchedule'
import StepMore from '@/components/form/StepMore'
import SuccessView from '@/components/form/SuccessView'

interface WizardBodyProps {
  form: LeadForm
  /** Called from the success view when embedded in a modal. */
  onDone?: () => void
}

/** Renders the active step of the lead form (shared by page + popup). */
export default function WizardBody({ form, onDone }: WizardBodyProps) {
  if (form.done) {
    return <SuccessView message={form.successMessage} onClose={onDone} />
  }

  return (
    <div key={form.step} className="animate-step">
      {form.step === 1 && (
        <StepDetails
          user={form.user}
          onUserChange={form.setUser}
          answers={form.step1}
          onAnswerChange={form.setStep1Answer}
          onContinue={form.submitStepOne}
          submitting={form.submitting}
          error={form.error}
        />
      )}
      {form.step === 2 && (
        <StepSchedule
          date={form.date}
          time={form.time}
          onDateChange={form.setDate}
          onTimeChange={form.setTime}
          onBack={() => form.goTo(1)}
          onContinue={form.submitStepTwo}
          submitting={form.submitting}
          error={form.error}
        />
      )}
      {form.step === 3 && (
        <StepMore
          answers={form.step3}
          onAnswerChange={form.setStep3Answer}
          onBack={() => form.goTo(2)}
          onSubmit={form.submitStepThree}
          submitting={form.submitting}
          error={form.error}
        />
      )}
    </div>
  )
}
