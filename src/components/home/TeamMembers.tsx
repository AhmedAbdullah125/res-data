import type { TeamMember, TeamMembersSection } from '../../types/home'
import Reveal from '../ui/Reveal'
import RichText from '../ui/RichText'

interface TeamMembersProps {
  section: TeamMembersSection
}

/** Photo when present, otherwise a branded initials placeholder. */
function MemberImage({ member }: { member: TeamMember }) {
  if (member.image) {
    return (
      <img
        src={member.image}
        alt={member.name}
        className="aspect-[342/244] w-full rounded-2xl object-cover"
      />
    )
  }

  const initials = member.name
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex aspect-[342/244] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-brand-light to-brand text-5xl font-semibold text-white">
      {initials}
    </div>
  )
}

export default function TeamMembers({ section }: TeamMembersProps) {
  const { header, members } = section

  return (
    <section id="team-members" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24 lg:py-28">
      <div className="mx-auto container flex flex-col gap-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="flex max-w-3xl flex-col gap-3">
          <h2 className="text-3xl font-medium tracking-tight text-brand sm:text-4xl">
            {header.title}
          </h2>
          {header.caption && (
            <p className="text-[15px] text-[#5b6577]">{header.caption}</p>
          )}
        </Reveal>

        {/* Member cards */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {members.map((member, i) => (
            <Reveal
              key={member.id}
              delay={i * 120}
              className="flex flex-col gap-4 rounded-3xl bg-[#f9f9f9] p-6 sm:p-8"
            >
              <MemberImage member={member} />

              <h3 className="text-2xl font-semibold tracking-tight text-brand">
                {member.name}
              </h3>
              <p className="text-base font-medium uppercase tracking-wide text-[#5b6577]">
                {member.position}
              </p>
              <RichText
                className="text-lg leading-relaxed text-[#5b6577]"
                html={member.description}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
