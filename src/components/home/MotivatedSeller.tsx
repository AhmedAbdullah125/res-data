import { useState } from 'react'
import type { MotivatedSellerSection } from '../../types/home'
import { MOCK_SELLER_ANNOTATIONS, MOCK_SELLER_IMAGE_FREE } from '../../mocks/home'
import Reveal from '../ui/Reveal'
import RichText from '../ui/RichText'
import AnnotatedHouse from './AnnotatedHouse'

interface MotivatedSellerProps {
  section: MotivatedSellerSection
}

/** Local placeholder until the backend serves the annotated house image. */
const FALLBACK_IMAGE = '/img.png'

/**
 * Colors the leading `'…'` quoted segment (e.g. ‘Motivated Seller’) plus the
 * text before it in brand-blue and the remainder in near-black, matching the
 * Figma two-tone heading without hard-coding the copy.
 */
function TwoToneHeading({ title }: { title: string }) {
  const match = title.match(/^(.*['’][^'’]*['’])(.*)$/)
  if (!match) return <span className="text-brand">{title}</span>

  const [, lead, rest] = match
  return (
    <>
      <span className="text-brand">{lead}</span>
      <span className="text-black">{rest}</span>
    </>
  )
}

export default function MotivatedSeller({ section }: MotivatedSellerProps) {
  const { header_1, motivated_seller, header_2 } = section
  const [freeImageBroken, setFreeImageBroken] = useState(false)

  // Prefer the clean image + overlaid labels. `image_free` wins when the
  // backend splits the two; otherwise `image` is itself the label-free artwork.
  // If it fails to load we drop to the bundled flattened graphic.
  const annotations = motivated_seller.annotations?.length
    ? motivated_seller.annotations
    : MOCK_SELLER_ANNOTATIONS
  const freeImage =
    motivated_seller.image_free || motivated_seller.image || MOCK_SELLER_IMAGE_FREE
  const annotated = Boolean(freeImage) && annotations.length > 0 && !freeImageBroken
  // Retrying the URL that just failed would fail the same way, so when the
  // overlay was drawing on `image` itself we go straight to the local graphic.
  const image =
    freeImageBroken && freeImage === motivated_seller.image
      ? FALLBACK_IMAGE
      : motivated_seller.image ?? FALLBACK_IMAGE

  return (
    <section id="services" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24 lg:py-28">
      <div className="mx-auto container flex flex-col items-center gap-10 px-4 sm:gap-14 sm:px-6 lg:px-8">
        {/* Heading + intro (header_1) */}
        <Reveal className="flex max-w-6xl flex-col items-center gap-4 text-center sm:gap-6">
          <h2 className="max-w-2xl text-2xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            <TwoToneHeading title={header_1.title} />
          </h2>
          {header_1.description && (
            <RichText
              className="max-w-3xl text-sm leading-relaxed text-[#4e4e4e] sm:text-base lg:text-lg"
              html={header_1.description}
            />
          )}
        </Reveal>

        {/* Two-column body: paragraph + annotated house image */}
        <div className="grid w-full items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <Reveal
            direction="right"
            className="max-w-md text-lg font-medium leading-[1.75] text-[#4e4e4e] [&_p]:m-0 sm:text-xl lg:text-2xl"
          >
              <RichText html={motivated_seller.description} />
          </Reveal>
          <Reveal direction="left" delay={150} className="flex justify-center">
            {annotated ? (
              <AnnotatedHouse
                src={freeImage}
                annotations={annotations}
                onImageError={() => setFreeImageBroken(true)}
              />
            ) : (
              <img
                src={image}
                alt="Property attributes RES-DATA analyzes: property type, owner age, price range, year built, distress indicators, and equity"
                className="h-auto w-full max-w-2xl"
              />
            )}
          </Reveal>
        </div>

        {/* Discovery statement (header_2) */}
        <Reveal className="flex max-w-3xl flex-col gap-2 text-center text-xl font-semibold leading-8 text-navy sm:text-2xl sm:leading-9 lg:text-[28px] lg:leading-[40px]">
          <p>{header_2.title}</p>
          {header_2.description && <RichText html={header_2.description} />}
        </Reveal>
      </div>
    </section>
  )
}
