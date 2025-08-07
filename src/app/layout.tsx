import { Metadata } from 'next'
import AuthProvider from '@/components/AuthProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cybersecurity Training Portal',
  description: 'Complete cybersecurity training and earn verified credentials',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
