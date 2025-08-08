# 🛡️ Cyber Practitioner Evaluation

A modern web application that provides interactive cybersecurity training and issues verified credentials using Microsoft Verified ID platform.

## ✨ Features

- **Interactive Quiz**: 5 cybersecurity questions covering essential security concepts
- **Real-time Feedback**: Immediate explanations for each answer
- **Progress Tracking**: Visual progress indicator throughout the quiz
- **Microsoft Verified ID Integration**: Real credential issuance using Microsoft Verified ID platform
- **Entra ID Authentication**: Secure organizational authentication
- **Responsive Design**: Modern UI that works on all devices
- **Accessibility**: Built with semantic HTML and ARIA support
- **QR Code Generation**: Working QR codes for credential acceptance

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun
- Microsoft Entra ID (Azure AD) tenant for authentication

### Entra ID App Registration Setup

Before running the application, you need to configure authentication with Microsoft Entra ID:

#### 1. Create App Registration

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to **Microsoft Entra ID** > **App registrations**
3. Click **"New registration"**
4. Fill in the details:

```
Name: Cyber Practitioner Evaluation
Supported account types: Accounts in this organizational directory only (Single tenant)
Redirect URI: 
  - Platform: Web
  - URI: http://localhost:3000/api/auth/callback/azure-ad
```

#### 2. Configure Authentication Settings

After creating the app registration:

1. Go to **Authentication** in the left menu
2. Add these **Redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/azure-ad
   https://yourdomain.com/api/auth/callback/azure-ad (for production)
   ```
3. Under **Implicit grant and hybrid flows**, enable:
   - ✅ **ID tokens** (used for OpenID Connect implicit flow)
4. Set **Logout URL** (optional):
   ```
   http://localhost:3000
   ```

#### 3. API Permissions

1. Go to **API permissions**
2. The default **Microsoft Graph** permissions should include:
   - `openid` - Sign users in
   - `profile` - View users' basic profile
   - `email` - View users' email address
3. Click **"Grant admin consent"** if you have admin rights

#### 4. Certificates & Secrets

1. Go to **Certificates & secrets**
2. Click **"New client secret"**
3. Add description: `Cyber Practitioner Evaluation Secret`
4. Set expiration: **24 months** (or as per your organization's policy)
5. **Copy the secret value immediately** - you won't see it again!

#### 5. Collect Required Information

From your App Registration, collect these values:

```
Application (client) ID: [Copy from Overview page]
Directory (tenant) ID: [Copy from Overview page]
Client Secret: [The secret you just created]
```

#### 6. Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Microsoft Entra ID (Azure AD) Configuration
AZURE_AD_CLIENT_ID=your-application-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_TENANT_ID=your-tenant-id

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key-generate-one

# Microsoft Verified ID Configuration (Required for credential issuance)
VERIFIABLE_CREDENTIAL_ENDPOINT=https://verifiedid.did.msidentity.com/v1.0/verifiableCredentials/createIssuanceRequest
VERIFIABLE_CREDENTIAL_AUTHORITY=did:web:verifiedid.entra.microsoft.com:your-tenant-id:your-authority-id
VERIFIABLE_CREDENTIAL_TYPE=VerifiedCredentialExpert
VERIFIABLE_CREDENTIAL_MANIFEST=https://verifiedid.did.msidentity.com/v1.0/tenants/your-tenant-id/verifiableCredentials/contracts/your-contract-id/manifest
VERIFIABLE_CREDENTIAL_CONTRACT_ID=your-contract-id
```

> **Important**: Never commit the `.env.local` file to version control. Add it to your `.gitignore`.

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx            # Main application with welcome/quiz/results flow
│   ├── globals.css         # Global styles
│   ├── auth/
│   │   └── signin/
│   │       └── page.tsx    # Authentication page
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts # NextAuth configuration
│       └── verifiable-credentials/
│           └── issue/
│               └── route.ts # Microsoft Verified ID API integration
├── components/
│   ├── QuizComponent.tsx   # Interactive quiz component
│   ├── CredentialResult.tsx # Results and credential issuance
│   ├── QRCodeDisplay.tsx   # QR code display component
│   └── AuthProvider.tsx    # Authentication context provider
└── lib/
    └── auth.ts             # NextAuth configuration
```

## 🎯 How It Works

1. **Authentication**: Users sign in with their Entra ID organizational account
2. **Welcome Page**: Introduction to the Cyber Practitioner Evaluation
3. **Take the Quiz**: Users answer 5 cybersecurity questions
4. **Get Feedback**: Immediate explanations for each answer
5. **View Results**: See your score and performance
6. **Earn Credentials**: Successful completion (60%+) triggers credential issuance
7. **Verified ID**: Real Microsoft Verified ID credentials are issued with QR codes
8. **Digital Wallet**: Users can scan QR codes to add credentials to their digital wallet

## 🔧 Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with Microsoft Entra ID provider
- **Credentials**: Microsoft Verified ID (production integration)
- **Session Management**: Server-side session handling
- **API Integration**: REST API endpoints for credential issuance
- **Deployment**: Ready for Vercel, Netlify, or any Node.js hosting

## 🔐 Authentication & Security

### Entra ID Authentication Features
- **Single Sign-On (SSO)**: Users authenticate with their organizational credentials
- **Token-based Authentication**: Secure JWT tokens for session management
- **Role-based Access**: Ready for future role-based feature implementation
- **Multi-factor Authentication**: Inherits MFA settings from Entra ID policies

### Security Notes
1. **Environment Variables**: Never commit `.env.local` to version control
2. **Client Secrets**: Rotate client secrets regularly (recommended every 6-12 months)
3. **Redirect URIs**: Only configure necessary redirect URIs
4. **Permissions**: Use principle of least privilege for API permissions
5. **Production**: Update redirect URIs and NEXTAUTH_URL for production deployment

### Token Configuration (Optional)
For additional user information, you can configure optional claims in Entra ID:
1. Go to **Token configuration** in your App Registration
2. Add optional claims:
   - `email` - User's email address
   - `given_name` - User's first name
   - `family_name` - User's last name
   - `upn` - User principal name

### Troubleshooting Authentication
- **AADSTS50011**: Check redirect URI configuration
- **AADSTS70001**: Verify application is enabled in the tenant
- **AADSTS650051**: Grant admin consent for API permissions
- **AADSTS90002**: Check tenant ID in configuration

## 📚 Quiz Topics

The cybersecurity assessment covers:
- Two-factor authentication (2FA)
- Password security best practices
- Phishing attacks and social engineering
- Ransomware threats and protection
- Email security and suspicious communications

## 🏆 Credential System

- **Passing Score**: 60% (3 out of 5 questions correct)
- **Credential Type**: VerifiedCredentialExpert
- **Verification**: Microsoft Verified ID technology
- **Portability**: Credentials can be shared and verified across platforms
- **Claims**: Includes user name, email, quiz score, and completion date
- **QR Code**: Working QR codes for digital wallet integration
- **Contract ID**: d4d9372b-e1b2-ad46-b484-6a767ea888ec

## 🔐 Microsoft Verified ID Integration

This application includes **production-ready** integration with Microsoft Verified ID for credential issuance.

### Current Implementation Status ✅
- ✅ Real Microsoft Verified ID API integration
- ✅ Working credential issuance process
- ✅ QR code generation and display
- ✅ Proper error handling and logging
- ✅ Token authentication with correct scopes
- ✅ Production endpoint configuration

### Recent Fixes Applied
- **API Endpoint**: Updated to use global Microsoft Verified ID endpoint
- **Authentication**: Simplified to use working token scope (`3db474b9-6a0c-4840-96ac-1fceb342124f/.default`)
- **Request Format**: Optimized payload structure for successful credential issuance
- **Error Handling**: Enhanced JSON parsing and response handling
- **QR Code Display**: Fixed duplicate data URL prefix issues

### Production Configuration
The application is configured for production use with:

```env
VERIFIABLE_CREDENTIAL_ENDPOINT=https://verifiedid.did.msidentity.com/v1.0/verifiableCredentials/createIssuanceRequest
VERIFIABLE_CREDENTIAL_AUTHORITY=did:web:verifiedid.entra.microsoft.com:your-tenant-id:your-authority-id
VERIFIABLE_CREDENTIAL_TYPE=VerifiedCredentialExpert
VERIFIABLE_CREDENTIAL_MANIFEST=https://verifiedid.did.msidentity.com/v1.0/tenants/your-tenant-id/verifiableCredentials/contracts/your-contract-id/manifest
```

### Authentication Flow
```
User Login (Entra ID) → Quiz Completion → Score Validation → Credential Issuance (Verified ID) → QR Code Display
```

### Setup Requirements

For production deployment, ensure:

1. **Microsoft Verified ID Service Enabled**:
   - Azure tenant with Verified ID service activated
   - Domain verification completed
   - Issuer authority configured

2. **Credential Contract Created**:
   - Use the provided `VID Display definition.txt` and `VID Rules definition.txt`
   - Contract ID properly configured in environment variables
   - Manifest URL accessible

3. **App Registration Permissions**:
   - Verified ID issuance permissions granted
   - Service principal configured with appropriate scopes
   - Client credentials flow enabled

4. **Environment Configuration**:
   - All required environment variables set
   - Endpoint URLs properly configured
   - Authentication tokens working

### Troubleshooting Common Issues

- **"Not Found" Errors**: Verify the endpoint URL and tenant ID
- **Token Authentication Failures**: Check client ID and secret configuration
- **JSON Parsing Errors**: Ensure proper response format handling
- **QR Code Issues**: Verify credential contract and manifest URLs
- **Callback URL Errors**: Remove callback configuration for localhost development

### Testing Verification

1. Complete the quiz with a passing score
2. Click "Issue Microsoft Verified Credential"
3. Verify QR code appears without errors
4. Test with Microsoft Authenticator or compatible digital wallet
5. Confirm credential details and claims are correct

## 🎨 Customization

### Adding Questions

Edit `src/components/QuizComponent.tsx` to add or modify questions:

```typescript
const questions: Question[] = [
  {
    id: 1,
    question: "Your question here",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 0, // Index of correct answer
    explanation: "Explanation of the correct answer"
  }
  // Add more questions...
]
```

### Styling

The application uses Tailwind CSS. Customize the design by modifying the utility classes in the components or updating the `tailwind.config.js` file.

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational and demonstration purposes.

## 🔗 Resources

- [Microsoft Verified ID Documentation](https://docs.microsoft.com/en-us/azure/active-directory/verifiable-credentials/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Cybersecurity Best Practices](https://www.cisa.gov/cybersecurity-best-practices)

---

**Status**: ✅ Production Ready - Microsoft Verified ID integration fully functional

Built with ❤️ using Next.js and Microsoft Verified ID
