'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import QuizComponent from '@/components/QuizComponent'
import CredentialResult from '@/components/CredentialResult'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'

export default function Home() {
  const { data: session, status } = useSession()
  const [currentPage, setCurrentPage] = useState<'welcome' | 'quiz' | 'result'>('welcome')
  const [quizScore, setQuizScore] = useState(0)

  const handleStartQuiz = () => {
    setCurrentPage('quiz')
  }

  const handleQuizComplete = (score: number) => {
    setQuizScore(score)
    setCurrentPage('result')
  }

  const resetToWelcome = () => {
    setCurrentPage('welcome')
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
    // Redirect to signin page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/signin'
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthenticatedLayout user={session.user}>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {currentPage === 'welcome' && (
            <>
              <header className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-800 mb-4">
                  🛡️ Cyber Practitioner Evaluation
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                  Welcome to the Cyber Practitioner Evaluation platform. This assessment is designed to validate 
                  the knowledge you acquired during our internal "Cyber practitioner" training program.
                </p>
              </header>

              <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">About This Evaluation</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Purpose
                    </h3>
                    <p className="text-blue-700 text-sm">
                      This evaluation tests your understanding of key cybersecurity concepts covered in the internal 
                      "Cyber practitioner" training program, ensuring you can apply this knowledge in real-world scenarios.
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Certification
                    </h3>
                    <p className="text-green-700 text-sm">
                      Upon Upon perfect completion (100% score), you'll receive a verified digital credential 
                      powered by Microsoft Verified ID that you can add to your Microsoft Authenticator application.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    What You'll Be Tested On
                  </h3>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• <strong>Multi-Factor Authentication (MFA):</strong> Understanding and implementing additional security layers</li>
                    <li>• <strong>Password Security:</strong> Best practices for creating and managing secure passwords</li>
                    <li>• <strong>Phishing Detection:</strong> Identifying and responding to social engineering attacks</li>
                    <li>• <strong>Ransomware Protection:</strong> Prevention strategies and incident response procedures</li>
                    <li>• <strong>Email Security:</strong> Recognizing threats and safe email practices</li>
                  </ul>
                </div>

                <div className="text-center">
                  <button
                    onClick={handleStartQuiz}
                    className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                  >
                    Start Evaluation
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    The evaluation consists of 5 questions and takes approximately 5 minutes to complete.
                  </p>
                </div>
              </div>
            </>
          )}

          {currentPage === 'quiz' && (
            <>
              <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                  🛡️ Cyber Practitioner Evaluation
                </h1>
              </header>
              <QuizComponent onComplete={handleQuizComplete} />
            </>
          )}

          {currentPage === 'result' && (
            <>
              <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                  🛡️ Cyber Practitioner Evaluation
                </h1>
              </header>
              <CredentialResult score={quizScore} onReset={resetToWelcome} />
            </>
          )}
        </div>
      </main>
    </AuthenticatedLayout>
  )
}
