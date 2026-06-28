# 🏥 MediScan AI

<div align="center">

![MediScan AI Logo](public/favicon.svg)

**AI-Powered Medical Image Analysis & Healthcare Management Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Google AI](https://img.shields.io/badge/Google_AI-Gemini-orange?style=for-the-badge&logo=google)](https://ai.google.dev/)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 Overview

**MediScan AI** is a comprehensive healthcare management platform that leverages artificial intelligence to analyze medical images, generate prescriptions, manage medications, and facilitate healthcare workflows. Built with Next.js 15, it provides separate dashboards for administrators, doctors, patients, and pharmacists.

### 🎯 Key Capabilities

- 🔍 **AI-Powered Medical Image Analysis** - OCR and intelligent analysis of medical reports
- 💊 **Smart Prescription Management** - Create, scan, and manage digital prescriptions with QR codes
- 🤖 **AI Medical Assistant** - Chat with documents and get medication suggestions
- 👥 **Multi-Role System** - Separate dashboards for Admin, Doctor, Patient, and Pharmacist
- 🔐 **Secure Authentication** - JWT-based auth with OAuth support (Google, GitHub, Apple)
- 📊 **Analytics Dashboard** - Real-time insights and healthcare metrics

---

## ✨ Features

### 🏥 For Healthcare Providers

- **Digital Prescription Creation** with QR code generation
- **Patient Management** system with comprehensive records
- **AI-Powered Medication Suggestions** based on symptoms
- **Medical Document Analysis** using Google Gemini AI
- **Prescription Tracking** with scan limits and validation
- **Team Collaboration** tools

### 💊 For Pharmacists

- **QR Code Scanner** for prescription verification
- **Medicine Inventory Management** with stock tracking
- **Prescription Validation** with real-time status updates
- **AI Assistant** for drug information and interactions
- **Order Management** system

### 👤 For Patients

- **Prescription Access** via secure QR codes
- **Medical History** tracking
- **Healthcare Provider** directory
- **Appointment Management** (coming soon)

### 🛡️ For Administrators

- **User Management** across all roles
- **System Analytics** and monitoring
- **Drug Database** management
- **Team Administration**
- **Activity Logs** and audit trails

---
### 🛡️ Screenshot
## Homepage

<img width="1714" height="871" alt="Screenshot 2025-12-01 044622" src="https://github.com/user-attachments/assets/18079e18-6d4f-4045-8a90-64274ceea437" />
<img width="1838" height="849" alt="Screenshot 2025-12-01 052355" src="https://github.com/user-attachments/assets/af1014f6-a3b6-48dc-875a-6ca658019cee" />
<img width="1901" height="914" alt="Screenshot 2025-12-01 052248" src="https://github.com/user-attachments/assets/ee9006dc-1e4b-405d-b966-289c48183b9a" />
<img width="1899" height="879" alt="Screenshot 2025-12-01 052426" src="https://github.com/user-attachments/assets/62dc90ac-e858-4d92-9f18-15e4b92788bc" />

## Loginpage

<img width="1723" height="880" alt="Screenshot 2025-12-01 044214" src="https://github.com/user-attachments/assets/f2a23f4f-bd89-4ce2-bdc6-290650cc523c" />

##  Signup 
<img width="1919" height="950" alt="signup" src="https://github.com/user-attachments/assets/4814d42c-56b3-4a4a-b1e7-cd94a5032133" />

##  Doctor dashboard
<img width="1708" height="867" alt="doctor dashboard1" src="https://github.com/user-attachments/assets/d35878df-aeb4-4f12-a382-5fdc60106b45" />

## Create a new Prescription
<img width="1709" height="871" alt="doctor dashboard2" src="https://github.com/user-attachments/assets/adc22cb7-1cb8-45e6-8817-56d1a5713156" />

##   Ai
<img width="1720" height="880" alt="AI" src="https://github.com/user-attachments/assets/5fb48c84-9fc9-48d0-a203-9f302db2b57b" />

##  Pharmacist dashboard
<img width="1726" height="875" alt="shop1" src="https://github.com/user-attachments/assets/7994323e-b10f-4744-b88d-1c1b7dd6498f" />

## Phescription scannner
<img width="1719" height="873" alt="Scan" src="https://github.com/user-attachments/assets/7c6d865d-2d79-4ca5-811e-6c1653916869" />

## Qr code example

<img width="400" height="400" alt="MediScan_Ai-Prescription-1782572176606" src="https://github.com/user-attachments/assets/b9550271-1244-48f2-b4a3-832c4842bb25" />

## 404  

<img width="1718" height="868" alt="404" src="https://github.com/user-attachments/assets/b0150fea-d2a3-4903-9ab7-6f209e860c3a" />
 

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.9
- **Styling:** Tailwind CSS 4.1
- **UI Components:** Radix UI, Shadcn UI
- **State Management:** React Hooks, SWR
- **Forms:** React Hook Form + Zod validation
- **Animations:** Framer Motion

### Backend
- **Runtime:** Node.js
- **API:** Next.js API Routes
- **Database:** MongoDB 7.0 + Mongoose ODM
- **Authentication:** JWT (Jose), OAuth 2.0
- **File Upload:** Multer
- **QR Codes:** QRCode.js

### AI & ML
- **AI Platform:** Google Genkit
- **Models:** Google Gemini (gemini-2.0-flash-exp)
- **OCR:** Google Cloud Vision API
- **Vector DB:** In-memory (development)

### DevOps & Tools
- **Package Manager:** npm
- **Linting:** ESLint
- **Build Tool:** Turbopack (Next.js)
- **Environment:** dotenv

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.17 or later
- **npm** 9.0 or later
- **MongoDB** database (local or cloud)
- **Google Cloud Account** with:
  - Gemini API access
  - Cloud Vision API enabled
- **OAuth Credentials** (optional, for social login):
  - Google OAuth 2.0
  - GitHub OAuth App
  - Apple Sign In

---

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Jaykumar122/MediScanAI.git
cd MediScanAi
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# ─── Database ─────────────────────────────────────────────────
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/securerx?retryWrites=true&w=majority

# ─── JWT Authentication ───────────────────────────────────────
JWT_SECRET=your-secret-key-minimum-32-characters-long-for-security

# ─── Google AI (Gemini) ───────────────────────────────────────
GOOGLE_GENAI_API_KEY=your-google-ai-api-key

# ─── Google Cloud Vision (OCR) ────────────────────────────────
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
GOOGLE_CLOUD_PROJECT_ID=your-project-id

# ─── OAuth Providers (Optional) ───────────────────────────────
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Apple Sign In
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=your-apple-private-key

# ─── Application ──────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Set Up Google Cloud Services

#### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to `.env` as `GOOGLE_GENAI_API_KEY`

#### Google Cloud Vision API
1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Cloud Vision API
3. Create a service account and download JSON key
4. Set path in `.env` as `GOOGLE_APPLICATION_CREDENTIALS`

### 5. Initialize Database

The database will be automatically initialized on first run. To manually create an admin user:

```bash
npm run admin:create admin@mediscan.com YourSecurePassword123
```

Verify admin creation:

```bash
npm run admin:list
```

---

## 🚀 Usage

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### Production Build

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

---

## 🗺️ Application Routes

### Authentication
- `/login` - User login (Doctor, Patient, Pharmacist)
- `/signup` - User registration
- `/admin/login` - Admin login portal
- `/role-selection` - OAuth role selection

### Dashboards

#### Admin Dashboard (`/dashboard/admin`)
- `/dashboard/admin` - Overview & analytics
- `/dashboard/admin/doctors` - Doctor management
- `/dashboard/admin/team` - Team administration
- `/dashboard/admin/drugs` - Medicine database
- `/dashboard/admin/users` - User management
- `/dashboard/admin/pharmacy` - Pharmacy management

#### Doctor Dashboard (`/dashboard/doctor`)
- `/dashboard/doctor` - Doctor overview
- `/dashboard/doctor/prescriptions` - Create prescriptions
- `/dashboard/doctor/doctors` - Doctor directory
- `/dashboard/doctor/drugs` - Medicine lookup
- `/dashboard/doctor/pharmacy` - Pharmacy network

#### Patient Dashboard (`/dashboard/patient`)
- `/dashboard/patient` - Patient overview
- `/dashboard/patient/prescriptions` - View prescriptions
- `/dashboard/patient/scan` - Scan QR codes

#### Pharmacist Dashboard (`/dashboard/pharmacist`)
- `/dashboard/pharmacist` - Pharmacy overview
- `/dashboard/pharmacist/scan` - Scan prescriptions
- `/dashboard/pharmacist/ai` - AI assistant

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/login              # User login
POST   /api/signup             # User registration
POST   /api/admin/login        # Admin login
POST   /api/logout             # Logout
GET    /api/auth/[provider]/callback  # OAuth callback
```

### Admin APIs
```
GET    /api/dashboard/admin             # Dashboard data
GET    /api/dashboard/admin/doctors     # List doctors
GET    /api/dashboard/admin/team        # List team members
GET    /api/dashboard/admin/drugs       # List medicines
POST   /api/dashboard/admin/drugs       # Add medicine
GET    /api/dashboard/admin/users       # List users
PATCH  /api/dashboard/admin/users       # Update user status
GET    /api/dashboard/admin/pharmacy    # List pharmacists
```

### Doctor APIs
```
GET    /api/dashboard/doctor            # Doctor dashboard
GET    /api/dashboard/doctor/resources  # Resources (doctors, drugs, pharmacy)
```

---

## 📁 Project Structure

```
mediscan-ai/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (auth)/            # Authentication pages
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── admin/login/
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── admin/
│   │   │   ├── doctor/
│   │   │   ├── patient/
│   │   │   └── pharmacist/
│   │   ├── api/               # API routes
│   │   │   ├── (auth)/
│   │   │   └── dashboard/
│   │   ├── actions.ts         # Server actions
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── ui/               # UI components
│   │   ├── app-sidebar.tsx
│   │   ├── site-header.tsx
│   │   └── ...
│   ├── lib/                   # Utility libraries
│   │   ├── actions.ts        # Server actions
│   │   ├── crypto.ts         # JWT utilities
│   │   └── definitions.ts    # Zod schemas
│   ├── models/               # MongoDB models
│   │   └── usermodels.ts
│   ├── ai/                   # AI workflows
│   │   ├── genkit.ts         # Genkit configuration
│   │   └── flows/            # AI flows
│   │       ├── medication-suggestion.ts
│   │       ├── ocr-and-summarize.ts
│   │       └── ...
│   ├── dbConfig/             # Database configuration
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript types
│   └── scripts/              # Utility scripts
├── public/                   # Static assets
├── .env                      # Environment variables
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS config
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

---

## 🔐 Authentication Flow

### User Authentication
1. User enters credentials on login page
2. Server validates against MongoDB
3. JWT token generated and returned
4. Token stored in localStorage and cookies
5. Protected routes verify token on each request

### OAuth Flow
1. User clicks social login button
2. Redirected to OAuth provider
3. User authorizes application
4. Callback with authorization code
5. If new user: role selection screen
6. JWT token generated
7. Redirected to appropriate dashboard

### Admin Authentication
- Separate login portal at `/admin/login`
- Only users with `role: "admin"` can access
- Enhanced security with audit logging

---

## 🤖 AI Features

### 1. Medical Image OCR & Analysis
```typescript
// Extract text and analyze medical reports
const result = await ocrAndSummarize({
  imageUrl: uploadedImageUrl
});
```

### 2. Medication Suggestions
```typescript
// Get AI-powered medication suggestions
const result = await getMedicationSuggestions({
  symptoms: "fever, headache, body aches"
});
```

### 3. Document Summarization
```typescript
// Summarize medical documents
const result = await summarizeMedicalDocument({
  documentText: extractedText
});
```

### 4. Chat with Documents
```typescript
// Ask questions about medical documents
const result = await chatWithDocument({
  question: "What is the diagnosis?",
  context: documentContent
});
```

---

## 👥 User Roles & Permissions

| Feature | Admin | Doctor | Patient | Pharmacist |
|---------|-------|--------|---------|------------|
| Create Prescriptions | ✅ | ✅ | ❌ | ❌ |
| Scan Prescriptions | ✅ | ✅ | ✅ | ✅ |
| Manage Users | ✅ | ❌ | ❌ | ❌ |
| Manage Drugs | ✅ | ❌ | ❌ | ❌ |
| View Analytics | ✅ | ✅ | ❌ | ✅ |
| Access AI Features | ✅ | ✅ | ❌ | ✅ |

---

## 🧪 Testing

### Run Tests (Coming Soon)
```bash
npm test
```

### Run Linter
```bash
npm run lint
```

---

## 📚 Documentation

- [Admin Setup Guide](./CREATE_ADMIN_USER.md) - Create and manage admin users
- [Quick Start Guide](./QUICK_START_ADMIN.txt) - Fast setup reference
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Technical details
- [OAuth Setup](./OAUTH_ADMIN_UPDATES.md) - OAuth configuration

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint for code formatting
- Write descriptive commit messages
- Add comments for complex logic
- Update documentation as needed

---

## 🐛 Known Issues & Roadmap

### Known Issues
- OpenTelemetry Jaeger exporter warning (non-breaking)
- Some OAuth providers may require additional configuration

### Roadmap
- [ ] Real-time notifications
- [ ] Appointment scheduling system
- [ ] Video consultation integration
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with EHR systems
- [ ] Telemedicine features

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: https://github.com/Jaykumar122

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Google AI](https://ai.google.dev/) - Gemini API
- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [Vercel](https://vercel.com/) - Hosting platform
- [MongoDB](https://www.mongodb.com/) - Database

---


<div align="center">

**Made with ❤️ for Healthcare**

⭐ Star this repo if you find it helpful!

[Report Bug](https://github.com/yourusername/mediscan-ai/issues) • [Request Feature](https://github.com/yourusername/mediscan-ai/issues)

</div>
