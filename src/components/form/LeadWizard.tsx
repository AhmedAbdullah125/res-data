'use client'

import { useLeadForm } from '@/components/form/useLeadForm'
import Stepper from '@/components/form/Stepper'
import WizardBody from '@/components/form/WizardBody'

/** Full-page lead form (used on /get-started): horizontal stepper + body. */
export default function LeadWizard() {
  const form = useLeadForm()

  return (
    <div className="rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:p-8">
      {!form.done && (
        <div className="mb-8">
          <Stepper current={form.step} />
        </div>
      )}
      <WizardBody form={form} />
    </div>
  )
}
