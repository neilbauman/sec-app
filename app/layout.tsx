import './globals.css'

export const metadata = {
  title: 'SSC App',
  description: 'Shelter Severity Classification Admin'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
