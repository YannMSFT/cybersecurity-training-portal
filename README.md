# 🛡️ Cybersecurity Training Portal

A modern web application that provides interactive cybersecurity training and issues verified credentials using Microsoft Verified ID platform.

## ✨ Features

- **Interactive Quiz**: 5 cybersecurity questions covering essential security concepts
- **Real-time Feedback**: Immediate explanations for each answer
- **Progress Tracking**: Visual progress indicator throughout the quiz
- **Verified Credentials**: Integration with Microsoft Verified ID for credential issuance
- **Responsive Design**: Modern UI that works on all devices
- **Accessibility**: Built with semantic HTML and ARIA support

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
Name: Cybersecurity Training Portal
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
3. Add description: `Cybersecurity Training Portal Secret`
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
# Azure AD Configuration
AZURE_AD_CLIENT_ID=your-application-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_TENANT_ID=your-tenant-id

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key-generate-one
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
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
└── components/
    ├── QuizComponent.tsx   # Interactive quiz component
    └── CredentialResult.tsx # Results and credential issuance
```

## 🎯 How It Works

1. **Take the Quiz**: Users answer 5 cybersecurity questions
2. **Get Feedback**: Immediate explanations for each answer
3. **View Results**: See your score and performance
4. **Earn Credentials**: Successful completion (67%+) allows credential issuance
5. **Verified ID**: Credentials are issued using Microsoft Verified ID technology

## 🔧 Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Microsoft Entra ID (Azure AD)
- **Credentials**: Microsoft Verified ID (mock implementation)
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
- **Credential Type**: Cybersecurity Training Certificate
- **Verification**: Microsoft Verified ID technology
- **Portability**: Credentials can be shared and verified across platforms

## 🔐 Microsoft Verified ID Integration

This application includes mock integration with Microsoft Verified ID for credential issuance. The authentication is handled separately by Entra ID.

### Current Implementation (Mock)
- Simulated credential issuance process
- Mock credential IDs and metadata
- Ready for production integration

### Production Setup
For real Microsoft Verified ID integration:

1. **Set up Verified ID Service**:
   - Enable Microsoft Verified ID in your Azure tenant
   - Configure issuer settings and domain verification

2. **Create Credential Definitions**:
   - Define cybersecurity training credential schema
   - Configure display properties and claims

3. **Implement API Integration**:
   - Replace mock functions with actual Verified ID APIs
   - Add credential issuance workflows
   - Implement verification endpoints

4. **Security Considerations**:
   - Separate authentication (Entra ID) from credential issuance
   - Validate user identity before issuing credentials
   - Implement proper audit logging

### Integration Architecture
```
User Authentication (Entra ID) → Quiz Completion → Credential Issuance (Verified ID)
```

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

Built with ❤️ using Next.js and Microsoft Verified ID
