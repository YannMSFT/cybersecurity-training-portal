import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface CredentialRequest {
  score: number
  totalQuestions: number
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { score, totalQuestions }: CredentialRequest = await request.json()
    
    // Validate passing score
    const passingScore = Math.ceil(totalQuestions * 0.6) // 60% passing
    if (score < passingScore) {
      return NextResponse.json(
        { error: 'Score does not meet minimum requirements for credential issuance' }, 
        { status: 400 }
      )
    }

    // Generate unique state for this request
    const state = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Prepare the Microsoft Verified ID request using the working format
    const verifiedIdRequest = {
      includeQRCode: true,
      authority: process.env.VERIFIABLE_CREDENTIAL_AUTHORITY!,
      registration: {
        clientName: "Cyber Practitioner Evaluation"
      },
      type: process.env.VERIFIABLE_CREDENTIAL_TYPE!,
      manifest: process.env.VERIFIABLE_CREDENTIAL_MANIFEST!,
      claims: {
        given_name: session.user.name?.split(' ')[0] || 'Unknown',
        family_name: session.user.name?.split(' ')[1] || 'User',
        email: session.user.email || 'unknown@example.com',
        quiz_score: `${score}/${totalQuestions}`,
        completion_date: new Date().toISOString().split('T')[0]
      }
    }

    // Get access token for Microsoft Verified ID API using working scope
    const tokenResponse = await fetch(`https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.AZURE_AD_CLIENT_ID!,
        client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
        scope: '3db474b9-6a0c-4840-96ac-1fceb342124f/.default',
        grant_type: 'client_credentials'
      })
    })

    const tokenData = await tokenResponse.json()
    
    if (!tokenResponse.ok) {
      console.error('Token request failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: tokenData
      })
      return NextResponse.json(
        { 
          error: 'Failed to obtain access token', 
          details: tokenData,
          status: tokenResponse.status 
        }, 
        { status: 500 }
      )
    }

    console.log('Access token obtained successfully')
    console.log('Using credential type:', process.env.VERIFIABLE_CREDENTIAL_TYPE!)
    console.log('Using manifest:', process.env.VERIFIABLE_CREDENTIAL_MANIFEST!)
    console.log('Making Verified ID request to:', process.env.VERIFIABLE_CREDENTIAL_ENDPOINT)
    console.log('Request payload:', JSON.stringify(verifiedIdRequest, null, 2))

    // Call Microsoft Verified ID Request Service API
    const issuanceResponse = await fetch(process.env.VERIFIABLE_CREDENTIAL_ENDPOINT!, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(verifiedIdRequest)
    })

    // Check if the response is JSON before parsing
    const contentType = issuanceResponse.headers.get('content-type')
    let issuanceData
    
    if (contentType && contentType.includes('application/json')) {
      try {
        issuanceData = await issuanceResponse.json()
      } catch (jsonError) {
        console.error('JSON parsing failed:', jsonError)
        const textResponse = await issuanceResponse.text()
        console.error('Raw response:', textResponse)
        
        return NextResponse.json(
          { 
            error: 'Invalid JSON response from Verified ID service', 
            details: textResponse,
            status: issuanceResponse.status
          }, 
          { status: 500 }
        )
      }
    } else {
      // If not JSON, get text response for debugging
      const textResponse = await issuanceResponse.text()
      console.error('Non-JSON response:', textResponse)
      console.error('Response status:', issuanceResponse.status)
      console.error('Response headers:', Object.fromEntries(issuanceResponse.headers.entries()))
      
      // Check if it's a successful response with QR code data in text format
      if (issuanceResponse.ok && textResponse.includes('data:image')) {
        // Handle successful text response that might contain QR code
        try {
          // Try to extract QR code if present
          const qrMatch = textResponse.match(/data:image\/[^;]+;base64[^"]+/)
          if (qrMatch) {
            return NextResponse.json({
              success: true,
              qrCode: qrMatch[0],
              url: textResponse,
              state: state
            })
          }
        } catch (parseError) {
          console.error('Failed to parse successful text response:', parseError)
        }
      }
      
      return NextResponse.json(
        { 
          error: 'Invalid response format from Verified ID service', 
          details: textResponse,
          status: issuanceResponse.status
        }, 
        { status: 500 }
      )
    }

    if (!issuanceResponse.ok) {
      const errorDetails = {
        status: issuanceResponse.status,
        statusText: issuanceResponse.statusText,
        error: issuanceData,
        request: verifiedIdRequest,
        headers: Object.fromEntries(issuanceResponse.headers.entries())
      }
      console.error('Credential issuance failed:', errorDetails)
      
      // Try to get more detailed error information
      if (issuanceData.error && issuanceData.error.innererror) {
        console.error('Inner error details:', JSON.stringify(issuanceData.error.innererror, null, 2))
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to initiate credential issuance', 
          details: issuanceData,
          status: issuanceResponse.status,
          requestId: issuanceData.requestId
        }, 
        { status: 500 }
      )
    }

    // Return the response which includes QR code data and request URL
    return NextResponse.json({
      success: true,
      requestId: issuanceData.requestId,
      url: issuanceData.url,
      qrCode: issuanceData.qrCode,
      expiry: issuanceData.expiry,
      state: state
    })

  } catch (error) {
    console.error('Credential issuance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
