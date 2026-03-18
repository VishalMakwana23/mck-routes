# McKesson Route Planning

This project is a React web application built with Vite and TailwindCSS, implementing authentication via Supabase.

## Tech Stack
- React + TypeScript (Vite)
- Tailwind CSS
- React Router DOM
- Supabase (Authentication)
- Lucide React (Icons)

## Setup Instructions

1. **Install dependencies**
   Make sure you are in the project folder `d:\Ziing\Akshay\supabase-auth-app`.
   ```bash
   npm install
   ```

2. **Create `.env` file**
   Add your Supabase keys to a `.env` file in the root of the project:
   ```env
   VITE_SUPABASE_URL=https://lybmlaovglfdutxcspnr.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_RYJrq911qmniRGxjX7vJmg_RGbwZTxI
   ```
   *(Note: The `.env` file is already created for you in this setup.)*

3. **Run the project**
   Start the development server:
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:5173`. You should see the exact login interface as your previous design powered by TailwindCSS.

## Features Included
- Persistent Auth state using Context API
- Protected routing guarding `/dashboard`
- Exactly matched, pixel-perfect Login UI
- Loading state handling
- Proper error messaging on auth failures
