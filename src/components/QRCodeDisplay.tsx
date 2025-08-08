'use client'

import { useState } from 'react'

interface QRCodeDisplayProps {
  qrCodeData: string
  requestUrl: string
  onClose: () => void
}

export default function QRCodeDisplay({ qrCodeData, requestUrl, onClose }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(requestUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const openInWallet = () => {
    // Try to open in Microsoft Authenticator or other wallet app
    window.open(requestUrl, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🏆 Credential Ready!
          </h2>
          <p className="text-gray-600">
            Scan the QR code below with your digital wallet to add your cyber practitioner evaluation credential
          </p>
        </div>

        {/* QR Code Display */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-6 text-center">
          <img 
            src={qrCodeData.startsWith('data:') ? qrCodeData : `data:image/png;base64,${qrCodeData}`}
            alt="QR Code for Credential"
            className="mx-auto max-w-full h-auto"
            style={{ maxWidth: '250px', maxHeight: '250px' }}
          />
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">📱 How to Add Your Credential:</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Open Microsoft Authenticator or your preferred digital wallet</li>
            <li>2. Scan the QR code above</li>
            <li>3. Follow the prompts to add the credential to your wallet</li>
            <li>4. Your cyber practitioner evaluation credential will be stored securely</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={openInWallet}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open in Digital Wallet
          </button>

          <button
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copied ? 'Copied!' : 'Copy Link'}
          </button>

          <button
            onClick={onClose}
            className="w-full px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>🔒 This credential is cryptographically signed and verifiable using Microsoft Verified ID technology</p>
        </div>
      </div>
    </div>
  )
}
