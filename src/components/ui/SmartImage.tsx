import Image from 'next/image'
import type { ImageProps } from 'next/image'

/**
 * Hosts declared in next.config.ts. next/image throws at runtime on any other
 * remote host, and the dashboard could start serving uploads from a CDN
 * without a front-end deploy — so anything unrecognised degrades to a plain
 * img element instead of crashing the page.
 */
const OPTIMIZED_HOSTS = ['dashboard.res-va.com', 'img.youtube.com']

function isOptimizable(src: string) {
  if (!src) return false
  if (src.startsWith('/')) return true // bundled public/ asset
  try {
    return OPTIMIZED_HOSTS.includes(new URL(src).hostname)
  } catch {
    return false
  }
}

type SmartImageProps = Omit<ImageProps, 'src'> & { src: string }

/** next/image where it's safe, a plain img element where it isn't. */
export default function SmartImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  priority,
  sizes,
  ...rest
}: SmartImageProps) {
  if (isOptimizable(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        className={className}
        fill={fill}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        {...rest}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width as number | undefined}
      height={height as number | undefined}
      loading={priority ? 'eager' : 'lazy'}
      // `fill` positions next/image absolutely; mirror that for the raw tag.
      className={[fill ? 'absolute inset-0 h-full w-full' : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
    />
  )
}
