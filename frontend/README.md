<<<<<<< HEAD
# Welcome to your project

## Project info

**URL**: https://lovable.dev/projects/07b9aeee-a074-4339-b1c4-6f455c647c5d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/07b9aeee-a074-4339-b1c4-6f455c647c5d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/07b9aeee-a074-4339-b1c4-6f455c647c5d) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
=======
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
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
