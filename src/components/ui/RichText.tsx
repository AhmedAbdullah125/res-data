interface RichTextProps {
  /** HTML string from the backend. */
  html: string
  className?: string
}

/**
 * Renders backend rich-text (which may contain <p>, <br>, entities, links…)
 * as HTML. Paragraph margins are stripped so it flows like the plain text it
 * replaces; pass typography classes via `className`.
 */
export default function RichText({ html, className = '' }: RichTextProps) {
  return (
    <div
      className={`[&_p]:m-0 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
