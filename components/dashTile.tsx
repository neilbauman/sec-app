// components/DashTile.tsx
import Link from 'next/link'

export default function DashTile(props: {
  title: string
  desc: string
  href?: string
  disabled?: boolean
}) {
  const { title, desc, href, disabled } = props
  const base = (
    <div
      className={`border rounded-2xl p-5 h-full ${
        disabled
          ? 'border-gray-200 bg-gray-50 text-gray-400'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      aria-disabled={disabled || undefined}
    >
      <div className="text-lg font-semibold mb-1">{title}</div>
      <div className="text-sm">{desc}</div>
    </div>
  )

  if (disabled || !href) {
    return <div className="pointer-events-none select-none">{base}</div>
  }
  return <Link href={href} className="block">{base}</Link>
}
