'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import QuizComponent from '@/components/QuizComponent'
import CredentialResult from '@/components/CredentialResult'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'

export default function Home() {
  const { data: session, status } = useSession()
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  const handleQuizComplete = (score: number) => {
    setQuizScore(score)
    setQuizCompleted(true)
  }

  const resetQuiz = () => {
    setQuizCompleted(false)
    setQuizScore(0)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    // Redirect to sign-in page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/signin'
    }
    return null
  }

  return (
    <AuthenticatedLayout user={session.user}>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              🛡️ Cybersecurity Training Portal
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Complete our cybersecurity assessment and earn a verified credential 
              powered by Microsoft Verified ID platform
            </p>
          </header>

          {!quizCompleted ? (
            <QuizComponent onComplete={handleQuizComplete} />
          ) : (
            <CredentialResult score={quizScore} onReset={resetQuiz} />
          )}
        </div>
      </main>
    </AuthenticatedLayout>
  )
}
