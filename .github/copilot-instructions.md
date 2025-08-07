<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Cybersecurity Training Portal - Copilot Instructions

This is a Next.js TypeScript application that serves as a cybersecurity training portal with Microsoft Verified ID integration.

## Project Overview
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Purpose**: Interactive cybersecurity quiz that issues verified credentials

## Key Components
- `QuizComponent`: Interactive 3-question cybersecurity quiz
- `CredentialResult`: Displays results and handles credential issuance
- Microsoft Verified ID integration for credential issuance

## Development Guidelines
- Use TypeScript for all components
- Follow React best practices with functional components and hooks
- Use Tailwind CSS for styling with responsive design
- Implement proper error handling for credential issuance
- Ensure accessibility with semantic HTML and ARIA labels

## Microsoft Verified ID Integration
- Currently uses mock credential issuance
- Real implementation would integrate with Microsoft Verified ID APIs
- Credential format follows industry standards

## Coding Standards
- Use descriptive variable and function names
- Add proper TypeScript types for all props and state
- Implement loading states for async operations
- Follow Next.js App Router patterns
- Use client components ('use client') where interactivity is required
