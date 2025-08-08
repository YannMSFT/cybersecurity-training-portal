'use client'

import { useState } from 'react'
import QRCodeDisplay from './QRCodeDisplay'

interface CredentialResultProps {
  score: number
  onReset: () => void
}

interface CredentialIssuanceResponse {
  success: boolean
  requestId: string
  url: string
  qrCode: string
  expiry: string
  state: string
  error?: string
}

export default function CredentialResult({ score, onReset }: CredentialResultProps) {
  const [isIssuing, setIsIssuing] = useState(false)
  const [credentialIssued, setCredentialIssued] = useState(false)
  const [qrCodeData, setQrCodeData] = useState<string | null>(null)
  const [credentialUrl, setCredentialUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const totalQuestions = 5
  const percentage = Math.round((score / totalQuestions) * 100)
  const passed = score >= 3 // Need at least 3/5 correct (60%) to pass

  const issueCredential = async () => {
    setIsIssuing(true)
    setError(null)
    
    try {
      // Call the Microsoft Verified ID API
      const response = await fetch('/api/verifiable-credentials/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score,
          totalQuestions
        })
      })

      const data: CredentialIssuanceResponse = await response.json()

      if (data.success) {
        setQrCodeData(data.qrCode)
        setCredentialUrl(data.url)
        setCredentialIssued(true)
      } else {
        setError(data.error || 'Failed to issue credential')
      }
    } catch (error) {
      console.error('Failed to issue credential:', error)
      setError('Network error occurred while issuing credential')
    } finally {
      setIsIssuing(false)
    }
  }

  const closeQRCode = () => {
    setQrCodeData(null)
    setCredentialUrl(null)
  }

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackground = () => {
    if (percentage >= 80) return 'bg-green-50 border-green-200'
    if (percentage >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${getScoreBackground()}`}>
          <span className={`text-3xl font-bold ${getScoreColor()}`}>
            {percentage}%
          </span>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Quiz Complete!
        </h2>
        
        <p className="text-xl text-gray-600 mb-2">
          You scored {score} out of {totalQuestions} questions correctly
        </p>
        
        {passed ? (
          <p className="text-lg text-green-600 font-medium">
            🎉 Congratulations! You passed the cybersecurity assessment
          </p>
        ) : (
          <p className="text-lg text-red-600 font-medium">
            📚 Keep studying! You need at least 60% to pass
          </p>
        )}
      </div>

      {passed && !credentialIssued && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-blue-800 mb-3">
            🏆 Earn Your Verified Credential
          </h3>
          <p className="text-blue-700 mb-4">
            You&apos;ve successfully completed the cybersecurity training! 
            Click below to issue your verified credential powered by Microsoft Verified ID.
          </p>
          
          <button
            onClick={issueCredential}
            disabled={isIssuing}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isIssuing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Issuing Credential...
              </span>
            ) : (
              'Issue Microsoft Verified Credential'
            )}
          </button>
        </div>
      )}

      {credentialIssued && !qrCodeData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-green-800 mb-3">
            ✅ Credential Request Initiated!
          </h3>
          <p className="text-green-700 mb-4">
            Your cybersecurity training credential request has been processed successfully.
          </p>
          
          <div className="bg-white border border-green-300 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Credential Details:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Type:</strong> Cybersecurity Practitioner</p>
              <p><strong>Issuer:</strong> Cyber Practitioner Evaluation</p>
              <p><strong>Score:</strong> {score}/{totalQuestions} ({percentage}%)</p>
              <p><strong>Issued:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="text-sm text-green-600">
            <p>🔗 This credential is verifiable using Microsoft Verified ID technology</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-red-800 mb-3">
            ❌ Credential Issuance Failed
          </h3>
          <p className="text-red-700 mb-4">
            {error}
          </p>
          <button
            onClick={issueCredential}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {!passed && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-yellow-800 mb-3">
            📖 Study Resources
          </h3>
          <p className="text-yellow-700 mb-4">
            Don&apos;t worry! Here are some resources to help you improve your cybersecurity knowledge:
          </p>
          <ul className="text-yellow-700 space-y-2 list-disc list-inside">
            <li>Review password security best practices</li>
            <li>Learn about two-factor authentication benefits</li>
            <li>Understand common phishing attack patterns</li>
            <li>Practice identifying suspicious emails and links</li>
          </ul>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onReset}
          className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors font-medium"
        >
          Take Quiz Again
        </button>
        
        {credentialIssued && (
          <button
            onClick={() => window.open('https://aka.ms/VerifiableCredentials', '_blank')}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Learn More About Verified ID
          </button>
        )}
      </div>

      {/* QR Code Modal */}
      {qrCodeData && credentialUrl && (
        <QRCodeDisplay
          qrCodeData={qrCodeData}
          requestUrl={credentialUrl}
          onClose={closeQRCode}
        />
      )}
    </div>
  )
}
