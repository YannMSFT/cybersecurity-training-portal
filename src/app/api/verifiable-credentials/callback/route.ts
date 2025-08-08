import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify the API key from the callback
    const apiKey = request.headers.get('api-key')
    if (apiKey !== process.env.NEXTAUTH_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Log the callback for debugging
    console.log('Verifiable Credential Callback:', body)

    // Handle different callback types
    switch (body.code) {
      case 'request_retrieved':
        console.log('QR Code was scanned or deep link was clicked')
        break
      case 'issuance_successful':
        console.log('Credential was successfully issued')
        break
      case 'issuance_error':
        console.log('Credential issuance failed:', body.error)
        break
      default:
        console.log('Unknown callback code:', body.code)
    }

    // In a production app, you might want to:
    // 1. Update database with credential status
    // 2. Send notifications to the user
    // 3. Update UI via WebSocket or SSE

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Callback processing error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET method for health check
export async function GET() {
  return NextResponse.json({ status: 'Callback endpoint is active' })
}
