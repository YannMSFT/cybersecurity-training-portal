import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Testing Verified ID availability and permissions in tenant:', process.env.AZURE_AD_TENANT_ID)
    
    // Test Microsoft Graph token (should work)
    const graphTokenResponse = await fetch(`https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.AZURE_AD_CLIENT_ID!,
        client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials'
      })
    })

    const graphTokenData = await graphTokenResponse.json()

    // Check tenant information and capabilities
    let tenantInfo = null
    let verifiedIdCapability = null
    
    if (graphTokenResponse.ok) {
      // Get tenant information
      const tenantResponse = await fetch(`https://graph.microsoft.com/v1.0/organization`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${graphTokenData.access_token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (tenantResponse.ok) {
        tenantInfo = await tenantResponse.json()
      }

      // Check if Verified ID is available (try different endpoints)
      const verifiedIdTests = []

      // Test 1: Direct Verified ID endpoint (should fail if not enabled)
      try {
        const vid1Response = await fetch('https://graph.microsoft.com/v1.0/verifiableCredentials/authorities', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${graphTokenData.access_token}`,
            'Content-Type': 'application/json'
          }
        })
        verifiedIdTests.push({
          endpoint: 'graph.microsoft.com/v1.0/verifiableCredentials/authorities',
          success: vid1Response.ok,
          status: vid1Response.status,
          error: vid1Response.ok ? null : await vid1Response.json()
        })
      } catch (e) {
        verifiedIdTests.push({
          endpoint: 'graph.microsoft.com/v1.0/verifiableCredentials/authorities',
          success: false,
          status: 'error',
          error: e instanceof Error ? e.message : 'Unknown error'
        })
      }

      // Test 2: Alternative Verified ID discovery
      try {
        const vid2Response = await fetch(`https://verifiedid.did.msidentity.com/v1.0/${process.env.AZURE_AD_TENANT_ID}/verifiableCredentials/authorities`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        verifiedIdTests.push({
          endpoint: `verifiedid.did.msidentity.com/v1.0/${process.env.AZURE_AD_TENANT_ID}/verifiableCredentials/authorities`,
          success: vid2Response.ok,
          status: vid2Response.status,
          error: vid2Response.ok ? null : await vid2Response.json()
        })
      } catch (e) {
        verifiedIdTests.push({
          endpoint: `verifiedid.did.msidentity.com/v1.0/${process.env.AZURE_AD_TENANT_ID}/verifiableCredentials/authorities`,
          success: false,
          status: 'error',
          error: e instanceof Error ? e.message : 'Unknown error'
        })
      }

      verifiedIdCapability = verifiedIdTests
    }

    const isVerifiedIdEnabled = verifiedIdCapability?.some(test => test.success) || false

    return NextResponse.json({
      tenantId: process.env.AZURE_AD_TENANT_ID,
      graphToken: {
        success: graphTokenResponse.ok,
        status: graphTokenResponse.status
      },
      tenantInfo: tenantInfo ? {
        displayName: tenantInfo.value?.[0]?.displayName,
        tenantType: tenantInfo.value?.[0]?.tenantType,
        countryLetterCode: tenantInfo.value?.[0]?.countryLetterCode
      } : null,
      verifiedIdTests: verifiedIdCapability,
      verifiedIdEnabled: isVerifiedIdEnabled,
      setupInstructions: {
        step1: "Go to Azure Portal (portal.azure.com)",
        step2: "Navigate to Microsoft Entra ID",
        step3: "Look for 'Verified ID' in the left menu or search for it",
        step4: "If you see 'Get started' or 'Setup', click it to enable Verified ID",
        step5: "Complete the onboarding wizard",
        step6: "Add VerifiableCredential.Create.All permission to your app registration",
        note: "You need Global Administrator or appropriate admin privileges to enable Verified ID"
      },
      recommendation: isVerifiedIdEnabled 
        ? "Verified ID is enabled! You can now create credentials." 
        : "Verified ID is not enabled. Please follow the setup instructions above."
    })

  } catch (error) {
    console.error('Test failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
