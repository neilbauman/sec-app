// app/framework/page.tsx
import FrameworkClient from './FrameworkClient'

export const dynamic = 'force-dynamic' // ensure this route is never prerendered

export default function Page() {
  return <FrameworkClient />
}
