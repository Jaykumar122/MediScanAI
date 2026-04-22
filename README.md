<div align="center">

<img src="https://img.shields.io/badge/MediScan%20AI-Healthcare%20Innovation-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyek0xMyAxN2gtMnYtNmgydjZ6bTAtOGgtMlY3aDJ2MnoiLz48L3N2Zz4=" />

# 🏥 MediScan AI

### AI-Powered Prescription Management System

**Revolutionizing Healthcare Delivery Through Intelligent QR-Based Prescriptions**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-Google-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Architecture](#-system-architecture) • [Dashboards](#-dashboards) • [Getting Started](#-getting-started) • [API Docs](#-api-reference) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

**MediScan AI** is a next-generation digital prescription management platform that addresses the critical challenges of modern healthcare — illegible handwriting, manual transcription errors, lack of standardization, and inefficient record handling. By combining **encrypted QR code technology**, **Google Gemini AI**, and **intelligent data processing**, MediScan AI creates a secure, seamless bridge between doctors, pharmacists, and patients.

> Prescription management remains one of healthcare's most error-prone processes. MediScan AI eliminates those errors at the source.

### 🎯 The Problem We Solve

| Problem | Impact | MediScan AI Solution |
|---|---|---|
| Illegible handwriting | Medication errors, patient harm | Digital structured prescriptions |
| Manual transcription | Delays in treatment | Encrypted QR code generation |
| No standardization | Interoperability failures | Unified data schema |
| Paper dependency | Inefficient workflows | Fully digital ecosystem |
| Drug misuse / duplication | Patient safety risks | AI-powered validation |
| Language barriers | Miscommunication | Multi-language AI summaries |

---

## ✨ Features

### 🔐 Encrypted QR Prescriptions
- Doctors generate **cryptographically secure QR codes** containing structured prescription data
- QR codes are **not publicly scannable** — only authorized medical shops and doctors can decode them
- Doctors can configure **scan limits** (e.g., a prescription may only be scanned 1–3 times) to prevent drug misuse and duplication
- Full audit trail of every QR scan event

### 🤖 Gemini AI Integration
- **Medical report summarization** in multiple languages — breaking language barriers between patients and providers
- **Skin disease detection** — users upload images of skin conditions and receive AI-generated medicine and treatment recommendations
- **Doctor's assistant** — AI helps doctors with medicine name suggestions, dosage guidance, and drug interaction warnings
- **Prescription validation** — automated checking of medicines, dosage, and duration before submission

### 👥 Four-Role Dashboard System
- **Doctor Dashboard** — create and manage prescriptions, view patient history, get AI assistance
- **Medical Shop (Pharmacy) Dashboard** — scan and verify QR prescriptions, manage dispensed records
- **Admin Dashboard** — system oversight, user management, analytics, and reporting
- **Patient (User) Dashboard** — view prescriptions, track medication history, set reminders, upload reports

### 📊 Additional Capabilities
- Real-time prescription status tracking
- Electronic Health Record (EHR) integration-ready architecture
- Medication adherence reminders for patients
- Secure digital prescription history for future reference
- Multi-language AI report summaries (powered by Gemini)
- Transparency and accountability through real-time access with strict privacy controls

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 15 (App Router) | SSR, routing, UI rendering |
| **Language** | TypeScript | Type safety across the full stack |
| **Styling** | Tailwind CSS | Responsive, utility-first design |
| **Backend** | Node.js + Next.js API Routes | REST API, business logic |
| **Database** | MongoDB (Mongoose) | Flexible document storage for medical records |
| **AI Engine** | Google Gemini API | Report summarization, image diagnosis, medicine assistance |
| **QR Technology** | Custom encrypted QR | Secure prescription encoding/decoding |
| **Auth** | NextAuth.js / JWT | Role-based access control |

---


## 📊 Dashboards

### 🩺 Doctor Dashboard
- Create new prescriptions with AI-assisted medicine suggestions
- Generate encrypted QR codes with custom scan limits
- View full patient prescription history
- Access AI summaries of patient medical reports
- Real-time prescription status tracking

### 💊 Medical Shop (Pharmacy) Dashboard
- Scan and decode encrypted QR prescriptions from authorized devices only
- Verify medicine names, dosage, and duration
- Track dispensed prescriptions and scan history
- Receive alerts for duplicate scans or exceeded scan limits

### 🔧 Admin Dashboard
- Manage all users (doctors, pharmacists, patients)
- System-wide analytics and prescription statistics
- Monitor QR scan logs and detect anomalies
- Configure system-wide settings and permissions

### 👤 Patient Dashboard
- View all personal prescriptions in a secure portal
- Scan history and dispensing status
- Upload medical reports and skin condition images for AI analysis
- Medication reminders and adherence tracking
- Multi-language AI summaries of reports

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- MongoDB (local or MongoDB Atlas)
- Google Gemini API key
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Jaykumar122/MediScanAI.git
cd mediscanai

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
### Running the App

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint

# Type check
npm run type-check
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🔌 API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/auth/logout` | Invalidate session |

### Prescriptions
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/prescriptions` | Create a new prescription |
| GET | `/api/prescriptions/:id` | Get prescription by ID |
| GET | `/api/prescriptions/patient/:id` | Get all prescriptions for a patient |
| PATCH | `/api/prescriptions/:id` | Update prescription |

### QR Codes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/qr/generate` | Generate encrypted QR from prescription |
| POST | `/api/qr/scan` | Decode and validate a QR scan |
| GET | `/api/qr/scan-history/:id` | Get QR scan audit log |

### AI Features
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/summarize` | Summarize a medical report (multi-language) |
| POST | `/api/ai/skin-diagnosis` | Analyze skin condition image |
| POST | `/api/ai/medicine-assist` | Get AI medicine suggestions for doctors |

---

## 🔒 Security

- **Prescription QR codes** are encrypted with AES-256 — unreadable by generic QR scanners
- **Role-based access control (RBAC)** — each dashboard is protected by role middleware
- **Scan limits** enforced server-side to prevent prescription duplication or drug misuse
- **JWT authentication** with short-lived tokens and refresh token rotation
- **MongoDB data** encrypted at rest (Atlas encryption or self-managed)
- All API routes validate user roles before processing any request

---

## 🌐 Multi-Language AI Support

MediScan AI leverages Google Gemini to summarize medical reports and prescriptions in multiple languages including:

`English` • `Hindi` • `Tamil` • `Telugu` • `Kannada` • `Bengali` • `Marathi` • `Gujarati` • `Spanish` • `French` • and more

---

## 🗺 Roadmap

- [x] Encrypted QR prescription generation
- [x] Role-based dashboards (Doctor, Pharmacy, Admin, Patient)
- [x] Gemini AI report summarization
- [x] Skin disease AI diagnosis
- [x] Scan limit enforcement
- [ ] Mobile app (React Native)
- [ ] EHR system integrations (HL7 FHIR)
- [ ] Telemedicine video consultation
- [ ] Wearable health data integration
- [ ] Blockchain-based prescription audit trail

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature description"

# 4. Push and open a Pull Request
git push origin feature/your-feature-name
```

Please follow [Conventional Commits](https://www.conventionalcommits.org/) and ensure all TypeScript types are properly defined.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

For questions, feedback, or collaboration:

- 📧 Email: `singhjay66555521@gmail.com`
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/mediscan-ai/issues)

---

<div align="center">

Made with ❤️ for safer, smarter healthcare

**MediScan AI** — *Bridging Doctors, Pharmacists, and Patients Through Technology*

</div>
