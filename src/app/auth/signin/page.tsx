'use client'

import { signIn, getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const [isSigningIn, setIsSigningIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already signed in
    const checkSession = async () => {
      const session = await getSession()
      if (session) {
        router.push('/')
      }
    }
    checkSession()
  }, [router])

  const handleSignIn = () => {
    if (isSigningIn) return
    
    setIsSigningIn(true)
    // Simple signIn call - let NextAuth handle everything
    signIn('azure-ad')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🛡️ Sign In
          </h1>
          <p className="text-gray-600">
            Access the Cyber Practitioner Evaluation
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSignIn}
            disabled={isSigningIn}
            style={{ pointerEvents: isSigningIn ? 'none' : 'auto' }}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Redirecting to Entra ID...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
                Sign in with Entra ID
              </>
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Sign in with your organizational account to access the training portal
          </p>
        </div>
      </div>
    </div>
  )
}
