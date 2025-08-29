import type { Metadata } from 'next'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'SSC App',
  description: 'Shelter Severity Classification admin',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
