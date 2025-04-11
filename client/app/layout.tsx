import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Student Job Tracker',
  description: 'A simple job tracker for students',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
