# Crack Off-Campus Frontend

This is the frontend for **Crack Off-Campus**, a platform for off-campus jobs, internships, resume reviews, job referrals, and career guidance.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)
- [Contact](#contact)

---

## Project Overview

This project provides a modern, responsive frontend for Crack Off-Campus, allowing users to:

- Search and filter job listings
- Access premium job features via payment integration (Cashfree)
- Manage user authentication and subscriptions

---

## Tech Stack

- **Vite** (build tool)
- **React** (UI library)
- **TypeScript** (type safety)
- **Redux Toolkit** (state management)
- **Tailwind CSS** (styling)
- **shadcn-ui** (UI components)

---

## Prerequisites

- **Node.js** (v16 or above recommended)
- **npm** (v8 or above)
- **Git** (for cloning the repository)

---

## Setup Instructions

1. **Clone the repository:**

   ```sh
   git clone <YOUR_GIT_URL>
   cd Crack-off-campus/frontend
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

---

## Configuration

Before running the project, you may need to update some configuration files:

### 1. Environment Variables

Create a `.env` file in the `frontend` directory (if not present):

```sh
cp .env.example .env
```

Edit `.env` and set the following variables as needed:

```
VITE_API_BASE_URL=https://crackoffcampus.com/api/v1
VITE_RAZORPAY_KEY_ID=<your_razorpay_key>
```

- **VITE_API_BASE_URL**: The base URL for your backend API. Change this if running the backend locally (e.g., `http://localhost:5000/api/v1`).
- **VITE_RAZORPAY_KEY_ID**: Your Razorpay public key for payment integration.

### 2. Update API URLs (if needed)

If your backend runs on a different URL/port, update API endpoints in the codebase (search for `https://crackoffcampus.com/api/v1` and replace with your local backend URL).

---

## Running Locally

Start the development server:

```sh
npm run dev
```

- The app will be available at [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).
- The server supports hot reloading for instant feedback on code changes.

---

## Troubleshooting

- **API errors:** Ensure your backend is running and the `VITE_API_BASE_URL` is correct.
- **Payment not working:** Make sure the payment keys are set and the payment SDKs are loaded.
- **CORS issues:** If running backend locally, enable CORS for your frontend origin.

---

## Deployment

To deploy, build the static files:

```sh
npm run build
```

Then serve the `dist` folder using any static server or deploy to your preferred hosting.

---

## Contact

For issues or questions, please contact the project maintainer or open an issue in the repository.

---
