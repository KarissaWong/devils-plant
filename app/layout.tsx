import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Devil's Plant - Arithmetic Game",
  description: 'A challenging arithmetic game where you combine tiles to reach target numbers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 